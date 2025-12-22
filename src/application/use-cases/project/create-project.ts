import type {
  ICreateProjectRequestDTO,
  ICreateProjectResponseDTO,
} from "../../dtos/project.js";
import type { ICreateProjectUseCase } from "../../interfaces/usecase/project/create-project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IProjectMapper } from "../../mappers/project.js";
import logger from "../../../utils/logger.js";
import type { IProjectFile } from "../../interfaces/s3-bucket/file-storage.js";
import type { IS3FileStorageService } from "../../providers/storage-service.js";

export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper,
    private _s3Service: IS3FileStorageService
  ) {}

  async execute(
    dto: ICreateProjectRequestDTO
  ): Promise<ICreateProjectResponseDTO> {
    logger.debug(`create project data: ${JSON.stringify(dto)}`);

    if (dto.files && dto.files.length > 0) {
      const uploadedFiles: IProjectFile[] = await this._s3Service.uploadFiles(
        dto.files,
        "projects"
      );
      logger.debug(`s3 bucket file url: ${uploadedFiles}`);
      dto.documents = uploadedFiles;
    }
    logger.debug(`documents keys: ${JSON.stringify(dto.documents)}`);

    
    const persistentEntity = this._projectMapper.toPersistenceEntity(dto);
    const projectDoc = await this._projectRepository.create(persistentEntity);
    logger.debug(`created Project: ${JSON.stringify(projectDoc)}`);
    const data = this._projectMapper.toResponseDTO(projectDoc);
    return { data };
  }
}
