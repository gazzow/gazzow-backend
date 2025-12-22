import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { PaymentStatus, TaskStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import type { ICompleteTaskRequestDTO } from "../../dtos/task.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IReleaseFundsUseCase } from "../../interfaces/usecase/payment/release-fund.js";
import type { ICompleteTaskUseCase } from "../../interfaces/usecase/task/complete-task.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class CompleteTaskUseCase implements ICompleteTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper,
    private _releaseFundsUseCase: IReleaseFundsUseCase
  ) {}
  async execute(dto: ICompleteTaskRequestDTO): Promise<void> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const task = this._taskMapper.toResponseDTO(taskDoc);

    if (task.status !== TaskStatus.SUBMITTED) {
      throw new AppError(
        ResponseMessages.UnableToMarkAsCompleted,
        HttpStatusCode.CONFLICT
      );
    }

    const update = {
      status: TaskStatus.COMPLETED,
      paymentStatus: PaymentStatus.RELEASED,
      completedAt: new Date(dto.time),
    };
    const payload = { taskId: dto.taskId };

    await Promise.all([
      this._taskRepository.update(dto.taskId, update),
      this._releaseFundsUseCase.execute(payload),
    ]);
  }
}
