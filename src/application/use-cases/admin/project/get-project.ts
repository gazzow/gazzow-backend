import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import type {
  IAdminGetProjectRequestDTO,
  IAdminGetProjectResponseDTO,
} from "../../../dtos/admin/project.js";
import type { IProjectRepository } from "../../../interfaces/repository/project-repository.js";
import type { IAdminGetProjectUseCase } from "../../../interfaces/usecase/admin/project/get-project.js";
import type { IProjectMapper } from "../../../mappers/project.js";

export class AdminGetProjectUseCase implements IAdminGetProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}
  async execute(
    dto: IAdminGetProjectRequestDTO
  ): Promise<IAdminGetProjectResponseDTO> {
    const projectDoc = await this._projectRepository.findById(dto.projectId);

    if (!projectDoc) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }
    const data = this._projectMapper.toResponseDTO(projectDoc);

    return { data };
  }
}
