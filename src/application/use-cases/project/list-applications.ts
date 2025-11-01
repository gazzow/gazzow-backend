import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IListApplicationRequestDTO,
  IListApplicationResponseDTO,
} from "../../dtos/application.js";
import type { IApplicationRepository } from "../../interfaces/repository/application-repository.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IListApplicationsUseCase } from "../../interfaces/usecase/project/list-applications.js";
import type { IApplicationMapper } from "../../mappers/application.js";

export class ListApplicationsUseCase implements IListApplicationsUseCase {
  constructor(
    private _applicationRepository: IApplicationRepository,
    private _projectRepository: IProjectRepository,
    private _applicationMapper: IApplicationMapper
  ) {}
  async execute(
    dto: IListApplicationRequestDTO
  ): Promise<IListApplicationResponseDTO> {
    const projectExists = await this._projectRepository.findById(dto.projectId);
    if (!projectExists) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const applicationsDoc = await this._applicationRepository.findByProjectId(
      dto.projectId
    );

    const data =
      applicationsDoc?.map((doc) => {
        return this._applicationMapper.toResponseWithApplicantDTO(doc);
      }) ?? [];

    return { data };
  }
}
