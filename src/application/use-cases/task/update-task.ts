import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
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
    const task = await this._taskRepository.findById(dto.taskId);

    if (!task) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (task.creatorId.toString() !== dto.userId) {
      throw new AppError(
        ResponseMessages.UnauthorizedTaskModification,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const updates = this._taskMapper.toUpdatePersistent(dto.data);
    const updatedTaskDoc = await this._taskRepository.update(
      dto.taskId,
      updates
    );
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
