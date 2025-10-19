import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IGetProjectRequestDTO,
  IGetProjectResponseDTO,
} from "../../dtos/project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IGetProjectUseCase } from "../../interfaces/usecase/project/get-project.js";
import type { IProjectMapper } from "../../mappers/project.js";

export class GetProjectUseCase implements IGetProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}
  async execute(dto: IGetProjectRequestDTO): Promise<IGetProjectResponseDTO> {
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
