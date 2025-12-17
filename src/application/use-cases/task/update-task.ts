import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import {
  PaymentStatus,
  RefundStatus,
  TaskStatus,
} from "../../../domain/enums/task.js";
import type { ITaskDocument } from "../../../infrastructure/db/models/task-model.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  IUpdateTaskRequestDTO,
  IUpdateTaskResponseDTO,
} from "../../dtos/task.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUpdateTaskUseCase } from "../../interfaces/usecase/task/update-task.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class UpdateTaskUseCase implements IUpdateTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper
  ) {}
  async execute(dto: IUpdateTaskRequestDTO): Promise<IUpdateTaskResponseDTO> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }
    const task = this._taskMapper.toDomain(taskDoc);

    if (task.status !== TaskStatus.TODO)
      throw new AppError(
        ResponseMessages.UnableToUpdateTaskWhileWorking,
        HttpStatusCode.CONFLICT
      );

    if (task.creatorId !== dto.userId)
      throw new AppError(
        ResponseMessages.UnauthorizedTaskModification,
        HttpStatusCode.UNAUTHORIZED
      );

    if (dto.data.assigneeId !== task.assigneeId) {
      logger.info("Adding assignee to this task");
    }

    const { estimatedHours, dueDate } = dto.data;

    const update: Partial<ITaskDocument> = {};

    if (
      estimatedHours !== undefined &&
      estimatedHours !== task.estimatedHours
    ) {
      logger.info("Amount changed, update payment status");
      const newTotal = estimatedHours * task.expectedRate;
      update.totalAmount = newTotal;

      // Case 1: User paid upfront, then increase hours
      if (task.amountInEscrow > 0 && newTotal > task.amountInEscrow) {
        logger.info("Total amount greater than escrow amount");
        update.balance = newTotal - task.amountInEscrow;
        update.paymentStatus = PaymentStatus.PENDING;
      }
      // Case 2: User paid upfront, then decrease hours
      else if (task.amountInEscrow > 0 && newTotal < task.amountInEscrow) {
        logger.info("Total amount lesser than escrow amount");
        update.refundAmount = task.amountInEscrow - newTotal;
        update.refundStatus = RefundStatus.PENDING;
      }
      // Case 3: User paid upfront, now estimatedHours reset to Initial hours / totalAmount == amountInEscrow
      else if (task.amountInEscrow > 0) {
        logger.info("Total amount == escrow amount");
        update.balance = 0;
        update.refundAmount = 0;
        update.refundStatus = RefundStatus.NONE;
        update.paymentStatus = PaymentStatus.ESCROW_HELD;
      }
      // Case 4: User edited hours before any payment
      else {
        logger.info("Edited hours before any payment");
        update.balance = newTotal;
        update.paymentStatus = PaymentStatus.PENDING;
      }
    }

    const updatePersistent = this._taskMapper.toUpdatePersistent(dto.data);

    const updatedTaskDoc = await this._taskRepository.update(dto.taskId, {
      ...updatePersistent,
      ...update,
    });

    if (!updatedTaskDoc) {
      throw new AppError(
        ResponseMessages.TaskUpdateFailed,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const data = this._taskMapper.toResponseDTO(updatedTaskDoc);

    return { data };
  }
}
