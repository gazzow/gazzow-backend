import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { TaskPaymentStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type { IReleaseFundsRequestDTO } from "../../dtos/payment.js";
import type { ISubscriptionRepository } from "../../interfaces/repository/subscription.repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { IReleaseFundsUseCase } from "../../interfaces/usecase/payment/release-fund.js";
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
    private _subscriptionMapper: ISubscriptionMapper
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

    const userDoc = await this._userRepository.findById(task.assigneeId);
    if (!userDoc)
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const user = this._userMapper.toPublicDTO(userDoc);
    if (!user.stripeAccountId) {
      throw new AppError(
        ResponseMessages.StripeAccountIdNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const subscriptionDoc = await this._subscriptionRepository.findByUserId(
      user.id
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
      `Total amount:- ${task.totalAmount} + refund:- ${task.refundAmount} to accountId: ${user.stripeAccountId}`
    );

    logger.debug(
      `Transferring amount:${totalAmount + refundAmount} to accountId: ${user.stripeAccountId}`
    );

    // Check account onboarding status
    const isOnboarded = await this._stripeService.checkOnboardingStatus(
      user.stripeAccountId
    );
    if (!isOnboarded)
      throw new AppError(
        ResponseMessages.StripeAccountOnboardingIncomplete,
        HttpStatusCode.BAD_REQUEST
      );

    const grandTotal = totalAmount + refundAmount;

    await Promise.all([
      this._stripeService.transferFunds(user.stripeAccountId, grandTotal),
      this._taskRepository.update(task.id, {
        paymentStatus: TaskPaymentStatus.PAID,
        paidAt: new Date(),
      }),
    ]);
  }
}
