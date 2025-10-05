import type {
  ICreateProjectRequestDTO,
  ICreateProjectResponseDTO,
} from "../../dtos/project.js";
import type { ICreateProjectUseCase } from "../../interfaces/usecase/project/create-project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IProjectMapper } from "../../mappers/project.js";
import logger from "../../../utils/logger.js";

export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}

  async execute(
    dto: ICreateProjectRequestDTO
  ): Promise<ICreateProjectResponseDTO> {
    logger.debug(`create project data: ${dto}`)
    const persistentEntity = this._projectMapper.toPersistenceEntity(dto);
    const project = await this._projectRepository.create(persistentEntity);
    const data = this._projectMapper.toResponseDTO(project);
    return { data };
  }
}
