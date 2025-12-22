import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { PaymentStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type { ITaskPaymentRequestDTO } from "../../dtos/payment.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { ITaskPaymentUseCase } from "../../interfaces/usecase/payment/task-payment.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class TaskPaymentUseCase implements ITaskPaymentUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper
  ) {}

  async execute(dto: ITaskPaymentRequestDTO): Promise<void> {
    logger.info(`Processing payment for task ID: ${dto.taskId}`);

    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }
    const task = this._taskMapper.toResponseDTO(taskDoc);

    const amountInEscrow = task.totalAmount;

    await this._taskRepository.update(dto.taskId, {
      paymentStatus: PaymentStatus.ESCROW_HELD,
      amountInEscrow,
      balance: 0,
    });
  }
}
