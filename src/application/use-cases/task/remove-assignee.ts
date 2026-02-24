import type { INotificationPayload } from "../../../domain/entities/message.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { NotificationType } from "../../../domain/enums/notification.js";
import { TaskRules } from "../../../domain/rules/task-rules.js";
import type { IRealtimeGateway } from "../../../infrastructure/config/socket/socket-gateway.js";
import { AppError } from "../../../utils/app-error.js";
import type { CreateNotificationDTO } from "../../dtos/notification.js";
import type {
  IRemoveAssigneeRequestDTO,
  IRemoveAssigneeResponseDTO,
} from "../../dtos/task.js";
import type { INotificationRepository } from "../../interfaces/repository/notification.repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { IRemoveAssigneeUseCase } from "../../interfaces/usecase/task/remove-assignee.js";
import type { INotificationMapper } from "../../mappers/notification.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class RemoveAssigneeUseCase implements IRemoveAssigneeUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper,
    private _userRepository: IUserRepository,
    private _realtimeGateway: IRealtimeGateway,
    private _notificationRepository: INotificationRepository,
    private _notificationMapper: INotificationMapper,
  ) {}

  async execute(
    dto: IRemoveAssigneeRequestDTO,
  ): Promise<IRemoveAssigneeResponseDTO> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);

    if (!taskDoc) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const task = this._taskMapper.toDomain(taskDoc);

    // Validate project ownership project
    if (!TaskRules.isTaskCreator(task.creatorId, dto.userId))
      throw new AppError(
        ResponseMessages.UnauthorizedTaskModification,
        HttpStatusCode.FORBIDDEN,
      );

    if (!TaskRules.canRemoveAssignee(task)) {
      throw new AppError(
        ResponseMessages.AssigneeNotFound,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const assigneeId = task.assigneeId!;

    const assignee = await this._userRepository.findById(assigneeId);
    if (!assignee) {
      throw new AppError(
        ResponseMessages.AssigneeNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const update = TaskRules.handleRemoveTaskAssignee(task);

    const updatePersistent =
      this._taskMapper.toRemoveAssigneePersistent(update);

    const updatedTaskDocument = await this._taskRepository.update(
      task.id,
      updatePersistent,
    );

    if (!updatedTaskDocument) {
      throw new AppError(
        ResponseMessages.TaskUpdateFailed,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedTask = this._taskMapper.toResponseDTO(updatedTaskDocument);

    // Create activity history - pending

    // create live-persistent notification
    const messageBody = `You are no longer assigned to the task: ${updatedTask.title}`;
    const messagePayload: INotificationPayload = {
      projectId: task.projectId,
      taskId: updatedTask.id,
      message: messageBody,
      title: `Task Update`,
    };

    const notificationPayload: CreateNotificationDTO = {
      userId: assigneeId,
      title: messagePayload.title,
      body: messagePayload.message,
      type: NotificationType.TASK,
      data: {
        type: "TASK",
        taskId: updatedTask.id,
        projectId: messagePayload.projectId,
      },
    };

    const notificationPersistent =
      this._notificationMapper.toPersistentModel(notificationPayload);
    const notificationDoc = await this._notificationRepository.create(
      notificationPersistent,
    );

    if (notificationDoc) {
      const count =
        await this._notificationRepository.getUnreadCountByUserId(assigneeId);

      this._realtimeGateway.emitToUser(
        assigneeId,
        "PROJECT_MESSAGE",
        messagePayload,
      );

      this._realtimeGateway.updateNotificationCount(assigneeId, count);
      this._realtimeGateway.emitToUser(assigneeId, "TASK_UNASSIGNED", {
        taskId: updatedTask.id,
      });
    }

    return { data: updatedTask };
  }
}
