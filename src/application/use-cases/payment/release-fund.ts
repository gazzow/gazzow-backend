import {
  PaymentStatus,
  PaymentType,
  type IPayment,
} from "../../../domain/entities/payment.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { RefundStatus, TaskPaymentStatus } from "../../../domain/enums/task.js";
import type { IPaymentRepository } from "../../../infrastructure/repositories/payment.repository.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type { IReleaseFundsRequestDTO } from "../../dtos/payment.js";
import type { ISubscriptionRepository } from "../../interfaces/repository/subscription.repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { IReleaseFundsUseCase } from "../../interfaces/usecase/payment/release-fund.js";
import type { IPaymentMapper } from "../../mappers/payment.js";
import type { ISubscriptionMapper } from "../../mappers/subscription.js";
import type { ITaskMapper } from "../../mappers/task.js";
import type { IUserMapper } from "../../mappers/user/user.js";
import type { IStripeService } from "../../providers/stripe-service.js";

export class ReleaseFundsUseCase implements IReleaseFundsUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _userRepository: IUserRepository,
    private _taskMapper: ITaskMapper,
    private _userMapper: IUserMapper,
    private _stripeService: IStripeService,
    private _subscriptionRepository: ISubscriptionRepository,
    private _subscriptionMapper: ISubscriptionMapper,
    private _paymentRepository: IPaymentRepository,
    private _paymentMapper: IPaymentMapper
  ) {}

  async execute(dto: IReleaseFundsRequestDTO) {
    logger.info("Releasing user fund from stripe dashboard");
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc)
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const task = this._taskMapper.toDomain(taskDoc);

    if (!task.assigneeId)
      throw new AppError(
        ResponseMessages.AssigneeIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );

    if (task.paymentStatus === TaskPaymentStatus.PAID)
      throw new AppError(
        ResponseMessages.TaskFundAlreadyReleased,
        HttpStatusCode.CONFLICT
      );

    logger.warn(`Task payment status: ${task.paymentStatus}`);

    const assigneeDoc = await this._userRepository.findById(task.assigneeId);
    if (!assigneeDoc)
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const assignee = this._userMapper.toPublicDTO(assigneeDoc);
    if (!assignee.stripeAccountId) {
      throw new AppError(
        ResponseMessages.StripeAccountIdNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const subscriptionDoc = await this._subscriptionRepository.findByUserId(
      assignee.id
    );

    let commissionRate = 15; // default

    if (subscriptionDoc) {
      logger.info("User have a valid subscription plan!");

      const { activePlan, endDate } =
        this._subscriptionMapper.toResponseDTO(subscriptionDoc);
      if (new Date(endDate) > new Date()) {
        commissionRate = activePlan.features.commissionRate;
      }
    }

    const platformFee = Math.floor(task.totalAmount * (commissionRate / 100));

    logger.debug(`Platform fee: ${platformFee}`);

    const totalAmount = task.totalAmount - platformFee;
    const refundAmount = task.refundAmount || 0;

    logger.debug(
      `Total amount:- ${task.totalAmount} + refund:- ${task.refundAmount} to accountId: ${assignee.stripeAccountId}`
    );

    logger.debug(
      `Transferring amount:${totalAmount} to accountId: ${assignee.stripeAccountId}`
    );

    // Check account onboarding status
    const isOnboarded = await this._stripeService.checkOnboardingStatus(
      assignee.stripeAccountId
    );

    if (!isOnboarded)
      throw new AppError(
        ResponseMessages.StripeAccountOnboardingIncomplete,
        HttpStatusCode.BAD_REQUEST
      );

    // Releasing net amount to contributor
    const transfer = await this._stripeService.transferFunds(
      assignee.stripeAccountId,
      totalAmount,
      {
        taskId: task.id,
        taskPaymentStatus: TaskPaymentStatus.RELEASED,
      }
    );

    // Create Transaction to mark payment history
    const persistentData: Partial<IPayment> = {
      userId: task.assigneeId,
      taskId: dto.taskId,
      stripeTransferId: transfer.id,
      platformFee: platformFee,
      netAmount: totalAmount,
      currency: "USD",
      type: PaymentType.PAYOUT,
      status: PaymentStatus.PENDING,
    };

    const persistentPayment =
      this._paymentMapper.toPersistentModel(persistentData);

    await this._paymentRepository.create(persistentPayment);

    if (refundAmount !== 0) {
      const creator = await this._userRepository.findById(task.creatorId);
      if (!creator) {
        logger.warn(
          "Creator Account not found while transferring refund amount"
        );
        throw new AppError(
          ResponseMessages.UserNotFound,
          HttpStatusCode.NOT_FOUND
        );
      }
      const { stripeAccountId } = this._userMapper.toPublicDTO(creator);

      if (!stripeAccountId) {
        logger.warn(
          "Creator Stripe Account onboarding is incomplete unable to refund amount"
        );
        throw new AppError(
          ResponseMessages.StripeAccountOnboardingIncomplete,
          HttpStatusCode.BAD_REQUEST
        );
      }

      // Releasing refund amount to creator
      const transfer = await this._stripeService.transferFunds(
        stripeAccountId,
        refundAmount,
        {
          taskId: task.id,
          refundStatus: RefundStatus.RELEASED,
        }
      );

      // Create Transaction to mark payment history
      const persistentData: Partial<IPayment> = {
        userId: task.creatorId,
        taskId: dto.taskId,
        stripeTransferId: transfer.id,
        totalAmount: refundAmount,
        currency: "USD",
        type: PaymentType.REFUND,
        status: PaymentStatus.PENDING,
      };

      const persistentPayment =
        this._paymentMapper.toPersistentModel(persistentData);

      await this._paymentRepository.create(persistentPayment);
    }
  }
}
