import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { PaymentStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type { IReleaseFundsRequestDTO } from "../../dtos/payment.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { IReleaseFundsUseCase } from "../../interfaces/usecase/payment/release-fund.js";
import type { ITaskMapper } from "../../mappers/task.js";
import type { IUserMapper } from "../../mappers/user/user.js";
import type { IStripeService } from "../../providers/stripe-service.js";

export class ReleaseFundsUseCase implements IReleaseFundsUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _userRepository: IUserRepository,
    private _taskMapper: ITaskMapper,
    private _userMapper: IUserMapper,
    private _stripeService: IStripeService
  ) {}

  async execute(dto: IReleaseFundsRequestDTO) {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc)
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    const task = this._taskMapper.toResponseDTO(taskDoc);

    if (!task.assigneeId)
      throw new AppError(
        ResponseMessages.AssigneeIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );

    if (task.paymentStatus === PaymentStatus.PAID)
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

    const PLATFORM_FEE_PERCENTAGE = 12;

    const platformFee = Math.floor(
      task.proposedAmount * (PLATFORM_FEE_PERCENTAGE / 100)
    );

    logger.debug(`Platform fee: ${platformFee}`);

    const totalAmount = task.proposedAmount - platformFee;

    logger.debug(
      `Transferring amount: ${totalAmount} to accountId: ${user.stripeAccountId}`
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

    await this._stripeService.transferFunds(user.stripeAccountId, totalAmount);

    await this._taskRepository.update(task.id, {
      paymentStatus: PaymentStatus.PAID,
      paidAt: new Date(),
    });
  }
}
