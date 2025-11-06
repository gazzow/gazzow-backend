import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IApplicationRequestDTO,
  IApplicationResponseDTO,
} from "../../dtos/application.js";
import type { IApplicationRepository } from "../../interfaces/repository/application-repository.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ICreateApplicationUseCase } from "../../interfaces/usecase/project/create-application.js";
import type { IApplicationMapper } from "../../mappers/application.js";

export class CreateApplicationUseCase implements ICreateApplicationUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _applicationRepository: IApplicationRepository,
    private _applicationMapper: IApplicationMapper
  ) {}
  async execute(dto: IApplicationRequestDTO): Promise<IApplicationResponseDTO> {
    const project = await this._projectRepository.findById(dto.projectId);
    if (!project) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (project.creatorId.equals(dto.applicantId)) {
      throw new AppError(
        ResponseMessages.SelfApplicationNotAllowed,
        HttpStatusCode.BAD_REQUEST
      );
    }
    const existingApplication =
      await this._applicationRepository.findByApplicantAndProject(
        dto.applicantId,
        dto.projectId
      );

    if (existingApplication) {
      throw new AppError(
        ResponseMessages.ApplicationAlreadyExists,
        HttpStatusCode.CONFLICT
      );
    }

    const persistentEntity = this._applicationMapper.toPersistence(dto);
    const applicationDoc =
      await this._applicationRepository.create(persistentEntity);

    const data = this._applicationMapper.toResponseDTO(applicationDoc);

    return { data };
  }
}
