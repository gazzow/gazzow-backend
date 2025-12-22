import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IApplicationRequestDTO,
  IApplicationResponseDTO,
} from "../../dtos/application.js";
import type { IApplicationRepository } from "../../interfaces/repository/application-repository.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { ICreateApplicationUseCase } from "../../interfaces/usecase/project/create-application.js";
import type { IApplicationMapper } from "../../mappers/application.js";
import type { IUserMapper } from "../../mappers/user/user.js";
import type { IStripeService } from "../../providers/stripe-service.js";

export class CreateApplicationUseCase implements ICreateApplicationUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _applicationRepository: IApplicationRepository,
    private _applicationMapper: IApplicationMapper,
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper,
    private _stripeService: IStripeService
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

    // Check user has a Stripe account
    const userDoc = await this._userRepository.findById(dto.applicantId);
    if (!userDoc) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const user = this._userMapper.toPublicDTO(userDoc);
    if (!user.stripeAccountId) {
      throw new AppError(
        ResponseMessages.StripeAccountIdNotFound,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const isOnboarded = await this._stripeService.checkOnboardingStatus(
      user.stripeAccountId
    );
    if (!isOnboarded) {
      throw new AppError(
        ResponseMessages.StripeAccountOnboardingIncomplete,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const persistentEntity = this._applicationMapper.toPersistence(dto);
    const applicationDoc =
      await this._applicationRepository.create(persistentEntity);

    const data = this._applicationMapper.toResponseDTO(applicationDoc);

    return { data };
  }
}
