import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { TaskStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import type { ICompleteTaskRequestDTO } from "../../dtos/task.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { ICompleteTaskUseCase } from "../../interfaces/usecase/task/complete-task.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class CompleteTaskUseCase implements ICompleteTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper
  ) {}
  async execute(dto: ICompleteTaskRequestDTO): Promise<void> {
    const task = await this._taskRepository.findById(dto.taskId);
    if (!task) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (task.status !== TaskStatus.SUBMITTED) {
      throw new AppError(
        ResponseMessages.UnableToMarkAsCompleted,
        HttpStatusCode.CONFLICT
      );
    }

    await this._taskRepository.update(dto.taskId, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date(dto.time),
    });
  }
}
