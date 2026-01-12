import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  ICreateTaskRequestDTO,
  ICreateTaskResponseDTO,
} from "../../dtos/task.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IProjectFile } from "../../interfaces/s3-bucket/file-storage.js";
import type { ICreateTaskUseCase } from "../../interfaces/usecase/task/create-task.js";
import type { ITaskMapper } from "../../mappers/task.js";
import type { IS3FileStorageService } from "../../providers/storage-service.js";

export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _projectRepository: IProjectRepository,
    private _taskMapper: ITaskMapper,
    private _s3Service: IS3FileStorageService
  ) {}
  async execute(dto: ICreateTaskRequestDTO): Promise<ICreateTaskResponseDTO> {

    const projectDoc = await this._projectRepository.findById(dto.projectId);
    if (!projectDoc) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (dto.assigneeId && projectDoc.creatorId.toString() !== dto.creatorId) {
      throw new AppError(
        ResponseMessages.UnauthorizedTaskCreation,
        HttpStatusCode.FORBIDDEN
      );
    }

    if (dto.files && dto.files.length > 0) {
      const uploadedFiles: IProjectFile[] = await this._s3Service.uploadFiles(
        dto.files,
        "tasks"
      );
      logger.debug(`s3 bucket file url: ${uploadedFiles}`);
      dto.documents = uploadedFiles;
    }
    logger.debug(`documents keys: ${JSON.stringify(dto.documents)}`);

    const persistentEntity = this._taskMapper.toPersistent(dto);
    const taskDoc = await this._taskRepository.create(persistentEntity);
    const data = this._taskMapper.toResponseDTO(taskDoc);

    logger.debug(`new task :${JSON.stringify(taskDoc)}`);

    return { data };
  }
}
