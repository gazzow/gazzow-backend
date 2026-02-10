import type { INotificationPayload } from "../../../domain/entities/message.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import type { IRealtimeGateway } from "../../../infrastructure/config/socket/socket-gateway.js";
import type { INotificationRepository } from "../../../infrastructure/repositories/notification.repository.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  IUpdateContributorStatusRequestDTO,
  IUpdateContributorStatusResponseDTO,
} from "../../dtos/contributor.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { INotificationMapper } from "../../mappers/notification.js";
import type { IProjectMapper } from "../../mappers/project.js";
import { NotificationType } from "../../../domain/enums/notification.js";
import type { CreateNotificationDTO } from "../../../domain/entities/notification.js";

export interface IUpdateContributorStatusUseCase {
  execute(
    dto: IUpdateContributorStatusRequestDTO,
  ): Promise<IUpdateContributorStatusResponseDTO>;
}

export class UpdateContributorStatusUseCase
  implements IUpdateContributorStatusUseCase
{
  constructor(
    private _projectRepository: IProjectRepository,
    private _taskRepository: ITaskRepository,
    private _projectMapper: IProjectMapper,
    private _realtimeGateway: IRealtimeGateway,
    private _notificationRepository: INotificationRepository,
    private _notificationMapper: INotificationMapper,
  ) {}

  async execute(
    dto: IUpdateContributorStatusRequestDTO,
  ): Promise<IUpdateContributorStatusResponseDTO> {
    const projectDoc = await this._projectRepository.findById(dto.projectId);

    if (!projectDoc) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const project = this._projectMapper.toDomain(projectDoc);

    const isValidContributor = project.contributors.some(
      (c) => c.userId === dto.contributorId,
    );

    if (!isValidContributor) {
      throw new AppError(
        ResponseMessages.ContributorNotFoundInProject,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // find task has not start working  and update it as unassigned for
    const taskDocs = await this._taskRepository.findByAssigneeId(
      dto.contributorId,
    );

    if (taskDocs && taskDocs.length === 0) {
      logger.info(`Contributor status updating to [${dto.status}]`);
      const updatedProject =
        await this._projectRepository.findContributorAndUpdateStatus(
          dto.projectId,
          dto.contributorId,
          dto.status,
        );

      if (!updatedProject) {
        throw new AppError(
          "Contributor Status update failed",
          HttpStatusCode.BAD_REQUEST,
        );
      }

      const project = this._projectMapper.toResponseDTO(updatedProject);

      const contributor = project.contributors.find(
        (c) => c.userId === dto.contributorId,
      );

      if (!contributor)
        throw new AppError(
          ResponseMessages.UnableToFindContributor,
          HttpStatusCode.NOT_FOUND,
        );

      const messageBody = `Your contributor status was updated to ${contributor.status} in ${project.title}.`;
     
      const messagePayload: INotificationPayload = {
        projectId: project.id,
        message: messageBody,
        title: `Project Update`,
      };

      this._realtimeGateway.emitToUser(
        contributor.userId,
        "PROJECT_MESSAGE",
        messagePayload,
      );

      const notificationPayload: CreateNotificationDTO = {
        userId: contributor.userId,
        title: messagePayload.title,
        body: messagePayload.message,
        type: NotificationType.PROJECT, // or NotificationType.SYSTEM // NotificationType.MESSAGE
        data: {
          type: "PROJECT",
          projectId: messagePayload.projectId,
        },
      };

      const notificationPersistent =
        this._notificationMapper.toPersistentModel(notificationPayload);
      const notificationDoc = await this._notificationRepository.create(
        notificationPersistent,
      );

      if (notificationDoc) {
        const count = await this._notificationRepository.getUnreadCountByUserId(
          contributor.userId,
        );
        logger.debug(`updating user notification bell icon count: ${count}`)
        this._realtimeGateway.updateNotificationCount(
          contributor.userId,
          count,
        );
      }

      return { data: project };
    } else {
      throw new AppError(
        "Contributor is currently assigned to active tasks",
        HttpStatusCode.CONFLICT,
      );
    }
  }
}
