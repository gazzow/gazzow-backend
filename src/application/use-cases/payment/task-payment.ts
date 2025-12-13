import { PaymentStatus } from "../../../domain/enums/task.js";
import logger from "../../../utils/logger.js";
import type { ITaskPaymentRequestDTO } from "../../dtos/payment.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { ITaskPaymentUseCase } from "../../interfaces/usecase/payment/task-payment.js";

export class TaskPaymentUseCase implements ITaskPaymentUseCase {
  constructor(private _taskRepository: ITaskRepository) {}

  async execute(dto: ITaskPaymentRequestDTO): Promise<void> {
    logger.info(`Processing payment for task ID: ${dto.taskId}`);

    await this._taskRepository.update(dto.taskId, {
      paymentStatus: PaymentStatus.ESCROW_HELD,
    });
  }
}
