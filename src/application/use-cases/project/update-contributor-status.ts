import type { INotificationPayload } from "../../../domain/entities/message.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import type { IRealtimeGateway } from "../../../infrastructure/config/socket/socket-gateway.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IUpdateContributorStatusRequestDTO,
  IUpdateContributorStatusResponseDTO,
} from "../../dtos/contributor.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { INotificationMapper } from "../../mappers/notification.js";
import type { IProjectMapper } from "../../mappers/project.js";
import { NotificationType } from "../../../domain/enums/notification.js";
import type { INotificationRepository } from "../../interfaces/repository/notification.repository.js";
import type { CreateNotificationDTO } from "../../dtos/notification.js";
import type { ITaskMapper } from "../../mappers/task.js";
import { TaskStatus } from "../../../domain/enums/task.js";

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
    private _taskMapper: ITaskMapper,
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

    const projectEntity = this._projectMapper.toDomain(projectDoc);

    const isValidContributor = projectEntity.contributors.some(
      (c) => c.userId === dto.contributorId,
    );

    if (!isValidContributor) {
      throw new AppError(
        ResponseMessages.ContributorNotFoundInProject,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // find task has not start working and update it as unassigned
    const taskDocs = await this._taskRepository.findByAssigneeId(
      dto.projectId,
      dto.contributorId,
    );

    const tasks =
      taskDocs && taskDocs.length > 0
        ? taskDocs.map((task) => this._taskMapper.toDomain(task))
        : [];

   
    // return task when task status in_progress / submitted
    const blockingTasks = tasks.filter((task) =>
      [TaskStatus.IN_PROGRESS, TaskStatus.SUBMITTED].includes(task.status),
    );

    if (blockingTasks.length > 0)
      throw new AppError(
        ResponseMessages.UnableToChangeContributorSTatus,
        HttpStatusCode.CONFLICT,
      );

    const updatedProject =
      await this._projectRepository.findContributorAndUpdateStatus(
        dto.projectId,
        dto.contributorId,
        dto.status,
      );

    if (!updatedProject) {
      throw new AppError(
        ResponseMessages.ContributorStatusUpdateFailed,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const data = this._projectMapper.toResponseDTO(updatedProject);

    const contributor = data.contributors.find(
      (c) => c.userId === dto.contributorId,
    );

    if (!contributor)
      throw new AppError(
        ResponseMessages.UnableToFindContributor,
        HttpStatusCode.NOT_FOUND,
      );

    const messageBody = `Your contributor status was updated to ${contributor.status} in ${data.title}.`;

    const messagePayload: INotificationPayload = {
      projectId: data.id,
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
      this._realtimeGateway.updateNotificationCount(contributor.userId, count);
    }

    return { data: data };
  }
}
