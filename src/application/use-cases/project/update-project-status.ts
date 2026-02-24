import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IUpdateProjectStatusRequestDTO,
  IUpdateProjectResponseDTO,
} from "../../dtos/project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IUpdateProjectStatusUseCase } from "../../interfaces/usecase/project/update-project-status.js";
import type { IProjectMapper } from "../../mappers/project.js";

export class UpdateProjectStatusUseCase implements IUpdateProjectStatusUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper,
  ) {}

  async execute(
    dto: IUpdateProjectStatusRequestDTO,
  ): Promise<IUpdateProjectResponseDTO> {
    const projectDocument = await this._projectRepository.findById(
      dto.projectId,
    );
    if (!projectDocument) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const project = this._projectMapper.toDomain(projectDocument);

    if (project.creatorId !== dto.userId) {
      console.log(project.creatorId, dto.userId);
      throw new AppError(
        ResponseMessages.UnauthorizedProjectModification,
        HttpStatusCode.FORBIDDEN,
      );
    }
    const updatedProject = await this._projectRepository.update(dto.projectId, {
      status: dto.status,
    });

    if (!updatedProject) {
      throw new AppError(
        ResponseMessages.ProjectStatusUpdateFailed,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const data = this._projectMapper.toResponseDTO(updatedProject);

    return { data };
  }
}
