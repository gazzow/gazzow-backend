import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type { ICreateTaskRequestDTO } from "../../dtos/task.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { ICreateTaskUseCase } from "../../interfaces/usecase/task/create-task.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _projectRepository: IProjectRepository,
    private _taskMapper: ITaskMapper
  ) {}
  async execute(dto: ICreateTaskRequestDTO): Promise<void> {
    logger.debug(`create task dto: ${JSON.stringify(dto)}`);

    const projectDoc = await this._projectRepository.findById(dto.projectId);
    if (!projectDoc) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (projectDoc.creatorId.toString() !== dto.creatorId) {
      throw new AppError(
        ResponseMessages.UnauthorizedTaskCreation,
        HttpStatusCode.FORBIDDEN
      );
    }

    const persistentEntity = this._taskMapper.toPersistent(dto);
    const taskDoc = await this._taskRepository.create(persistentEntity);

    logger.debug(`new task :${JSON.stringify(taskDoc)}`);
  }
}
