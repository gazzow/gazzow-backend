import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { TaskStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import type { ISubmitTaskRequestDTO } from "../../dtos/task.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { ISubmitTaskUseCase } from "../../interfaces/usecase/task/submit-task.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class SubmitTaskUseCase implements ISubmitTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,

    private _taskMapper: ITaskMapper
  ) {}

  async execute(dto: ISubmitTaskRequestDTO): Promise<void> {
    const task = await this._taskRepository.findById(dto.taskId);
    if (!task) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (task.status !== TaskStatus.IN_PROGRESS) {
      throw new AppError(
        ResponseMessages.UnableToSubmitTask,
        HttpStatusCode.CONFLICT
      );
    }

    await this._taskRepository.update(dto.taskId, {
      status: TaskStatus.SUBMITTED,
      submittedAt: new Date(dto.time),
    });
  }
}
