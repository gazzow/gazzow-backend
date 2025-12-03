import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { TaskStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import type { IStartWorkRequestDTO } from "../../dtos/task.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IStartWorkUseCase } from "../../interfaces/usecase/task/start-task.js";

export class StartWorkUseCase implements IStartWorkUseCase {
  constructor(private _taskRepository: ITaskRepository) {}

  async execute(dto: IStartWorkRequestDTO): Promise<void> {
    const task = await this._taskRepository.findById(dto.taskId);

    if (!task) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (task.status !== TaskStatus.TODO) {
      throw new AppError(
        ResponseMessages.UnableToStartTask,
        HttpStatusCode.CONFLICT
      );
    }

    await this._taskRepository.update(dto.taskId, {
      status: TaskStatus.IN_PROGRESS,
      acceptedAt: new Date(dto.time),
    });
  }
}
