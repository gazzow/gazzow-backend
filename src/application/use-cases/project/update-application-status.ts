import { ApplicationStatus } from "../../../domain/enums/application.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ContributorStatus } from "../../../domain/enums/project.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type { IUpdateApplicationStatusRequestDTO } from "../../dtos/application.js";
import type { IApplicationRepository } from "../../interfaces/repository/application-repository.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IUpdateApplicationStatusUseCase } from "../../interfaces/usecase/project/update-application-status.js";

export class UpdateApplicationStatusUseCase
  implements IUpdateApplicationStatusUseCase
{
  constructor(
    private _projectRepository: IProjectRepository,
    private _applicationRepository: IApplicationRepository
  ) {}

  async execute(dto: IUpdateApplicationStatusRequestDTO): Promise<void> {
    const project = await this._projectRepository.findById(dto.projectId);
    if (!project) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }


    const application = await this._applicationRepository.findById(
      dto.applicationId
    );
    if (!application) {
      throw new AppError(
        ResponseMessages.ApplicationNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }
    logger.debug(`application status: ${application.status}`);
    logger.debug(`dto status: ${dto.status}`);
    if (application.status !== ApplicationStatus.PENDING) {
      throw new AppError(
        "Invalid Application Status",
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (dto.status === ApplicationStatus.ACCEPTED) {
      // Update application status to accepted
      await this._applicationRepository.updateStatus(
        dto.applicationId,
        ApplicationStatus.ACCEPTED
      );

      // Add user as project contributor
      await this._projectRepository.addContributor(
        dto.projectId,
        application.applicantId.toString(),
        ContributorStatus.ACTIVE
      );
    } else if (dto.status === ApplicationStatus.REJECTED) {
      // Update application status to rejected
      await this._applicationRepository.updateStatus(
        dto.applicationId,
        ApplicationStatus.REJECTED
      );
    }
  }
}
