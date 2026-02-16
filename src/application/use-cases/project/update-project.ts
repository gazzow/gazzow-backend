import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IUpdateProjectRequestDTO,
  IUpdateProjectResponseDTO,
} from "../../dtos/project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IUpdateProjectUseCase } from "../../interfaces/usecase/project/update-project.js";
import type { IProjectMapper } from "../../mappers/project.js";

export class UpdateProjectUseCase implements IUpdateProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}
  async execute(
    dto: IUpdateProjectRequestDTO
  ): Promise<IUpdateProjectResponseDTO> {
    const project = await this._projectRepository.findById(dto.projectId);
    if (!project) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (dto.userId !== project.creatorId.toString()) {
      throw new AppError(
        ResponseMessages.UnauthorizedProjectModification,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const data = this._projectMapper.toUpdateProjectEntity(dto.data);
    const projectDoc = await this._projectRepository.update(
      dto.projectId,
      data
    );

    if (!projectDoc) {
      throw new AppError(
        ResponseMessages.ProjectUpdateFailed,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
    const updatedProject = this._projectMapper.toResponseDTO(projectDoc);

    return { data: updatedProject };
  }
}
