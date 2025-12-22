import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IGetTaskRequestDTO,
  IGetTaskResponseDTO,
} from "../../dtos/task.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IGetTaskUseCase } from "../../interfaces/usecase/task/get-task.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class GetTaskUseCase implements IGetTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper
  ) {}

  async execute(dto: IGetTaskRequestDTO): Promise<IGetTaskResponseDTO> {
    const task = await this._taskRepository.findByIdAndPopulate(dto.taskId);

    if (!task) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const data = this._taskMapper.toPopulatedResponseDTO(task);

    return { data };
  }
}
