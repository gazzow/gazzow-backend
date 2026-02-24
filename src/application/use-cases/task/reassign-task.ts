import type { INotificationPayload } from "../../../domain/entities/message.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { NotificationType } from "../../../domain/enums/notification.js";
import { TaskRules } from "../../../domain/rules/task-rules.js";
import type { IRealtimeGateway } from "../../../infrastructure/config/socket/socket-gateway.js";
import { AppError } from "../../../utils/app-error.js";
import type { CreateNotificationDTO } from "../../dtos/notification.js";
import type {
  IReassignTaskRequestDTO,
  IReassignTaskResponseDTO,
} from "../../dtos/task.js";
import type { INotificationRepository } from "../../interfaces/repository/notification.repository.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IReassignTaskUseCase } from "../../interfaces/usecase/task/reassign-task.js";
import type { INotificationMapper } from "../../mappers/notification.js";
import type { IProjectMapper } from "../../mappers/project.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class ReassignTaskUseCase implements IReassignTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper,
    private _taskMapper: ITaskMapper,
    private _realtimeGateway: IRealtimeGateway,
    private _notificationRepository: INotificationRepository,
    private _notificationMapper: INotificationMapper,
  ) {}

  async execute(
    dto: IReassignTaskRequestDTO,
  ): Promise<IReassignTaskResponseDTO> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const task = this._taskMapper.toDomain(taskDoc);

    // Validate project ownership (project & user) - pending
    if (!TaskRules.isTaskCreator(task.creatorId, dto.userId))
      throw new AppError(
        ResponseMessages.UnauthorizedTaskModification,
        HttpStatusCode.FORBIDDEN,
      );

    if (dto.assigneeId === task.assigneeId) {
      throw new AppError(
        ResponseMessages.TaskAlreadyAssignedToUser,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (TaskRules.hasWorkStarted(task.status)) {
      throw new AppError(
        ResponseMessages.UnableToReassignTaskWhileInProgress,
        HttpStatusCode.FORBIDDEN,
      );
    }

    if (!TaskRules.canReassign(task.assigneeStatus)) {
      throw new AppError(
        ResponseMessages.CannotReassignWithoutAssignee,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // check new assignee is a valid contributor of this project
    const populatedProjectDoc = await this._projectRepository.findContributors(
      task.projectId,
    );

    if (!populatedProjectDoc) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const contributorDoc = populatedProjectDoc.contributors;

    const contributors = contributorDoc.map((c) => {
      return this._projectMapper.toListContributorsEntity(c);
    });

    const contributor = TaskRules.getValidContributor(
      dto.assigneeId,
      contributors,
    );

    if (!contributor) {
      throw new AppError(
        ResponseMessages.UserIsNotAProjectContributor,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // Create activity history - pending

    // Handle Financial
    const currentRate = contributor.expectedRate;
    const newTotal = task.estimatedHours * currentRate;

    const reCalculatedFinancial = TaskRules.reCalculateFinancial(
      newTotal,
      task,
    );

    // Reassign
    const updatePersistent = this._taskMapper.toReassignPersistent({
      assigneeId: dto.assigneeId,
      expectedRate: currentRate,
      totalAmount: newTotal,
      reassignedAt: new Date(),
      ...reCalculatedFinancial,
    });

    const updatedTaskDoc = await this._taskRepository.update(
      task.id,
      updatePersistent,
    );

    if (!updatedTaskDoc) {
      throw new AppError(
        ResponseMessages.TaskUpdateFailed,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedTask = this._taskMapper.toResponseDTO(updatedTaskDoc);

    // Send Notification & socket event for prev assignee
    if (task.assigneeId) {
      const messageBodyPrevAssignee = `You are no longer assigned to the task: ${updatedTask.title}`;

      const messagePayloadPrevAssignee: INotificationPayload = {
        projectId: task.projectId,
        taskId: updatedTask.id,
        message: messageBodyPrevAssignee,
        title: `Task Update`,
      };

      const prevAssigneeNotificationPayload: CreateNotificationDTO = {
        userId: task.assigneeId,
        title: messagePayloadPrevAssignee.title,
        body: messagePayloadPrevAssignee.message,
        type: NotificationType.TASK,
        data: {
          type: "TASK",
          taskId: task.id,
          projectId: messagePayloadPrevAssignee.projectId,
        },
      };

      const notificationPersistent = this._notificationMapper.toPersistentModel(
        prevAssigneeNotificationPayload,
      );
      const notificationDoc = await this._notificationRepository.create(
        notificationPersistent,
      );

      if (notificationDoc) {
        const count = await this._notificationRepository.getUnreadCountByUserId(
          task.assigneeId,
        );

        this._realtimeGateway.emitToUser(
          task.assigneeId,
          "PROJECT_MESSAGE",
          messagePayloadPrevAssignee,
        );

        this._realtimeGateway.updateNotificationCount(task.assigneeId, count);
        this._realtimeGateway.emitToUser(task.assigneeId, "TASK_UNASSIGNED", {
          taskId: updatedTask.id,
        });
      }
    }

    if (updatedTask.assigneeId) {
      // Send notification & socket event for new assignee
      const messageBodyNewAssignee = `You are now assigned to the task: ${task.title}`;

      const messagePayloadNewAssignee: INotificationPayload = {
        projectId: updatedTask.projectId,
        taskId: updatedTask.id,
        message: messageBodyNewAssignee,
        title: `Task Update`,
      };

      const newAssigneeNotificationPayload: CreateNotificationDTO = {
        userId: updatedTask.assigneeId,
        title: messagePayloadNewAssignee.title,
        body: messagePayloadNewAssignee.message,
        type: NotificationType.TASK,
        data: {
          type: "TASK",
          taskId: updatedTask.id,
          projectId: messagePayloadNewAssignee.projectId,
        },
      };

      const notificationPersistent = this._notificationMapper.toPersistentModel(
        newAssigneeNotificationPayload,
      );
      const notificationDoc = await this._notificationRepository.create(
        notificationPersistent,
      );

      if (notificationDoc) {
        const count = await this._notificationRepository.getUnreadCountByUserId(
          updatedTask.assigneeId,
        );

        this._realtimeGateway.emitToUser(
          updatedTask.assigneeId,
          "PROJECT_MESSAGE",
          messagePayloadNewAssignee,
        );

        this._realtimeGateway.updateNotificationCount(
          updatedTask.assigneeId,
          count,
        );
        this._realtimeGateway.emitToUser(
          updatedTask.assigneeId,
          "TASK_ASSIGNED",
          {
            taskId: updatedTask.id,
          },
        );
      }
    }

    return {
      data: updatedTask,
    };
  }
}
