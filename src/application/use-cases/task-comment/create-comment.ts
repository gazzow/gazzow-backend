import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { NotificationType } from "../../../domain/enums/notification.js";
import { NotificationModel } from "../../../infrastructure/db/models/notification.model.js";
import { TokenModel } from "../../../infrastructure/db/models/token-model.js";
import { NotificationService } from "../../../infrastructure/providers/notification.service.js";
import { PushService } from "../../../infrastructure/providers/push.service.js";
import { NotificationRepository } from "../../../infrastructure/repositories/notification.repository.js";
import { TokenRepository } from "../../../infrastructure/repositories/token-repository.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  CreateCommentDTOWithAuthor,
  ICreateTaskCommentRequestDTO,
  ICreateTaskCommentResponseDTO,
} from "../../dtos/task-comment.js";
import type { ITaskCommentRepository } from "../../interfaces/repository/task-comment.repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { ICreateTaskCommentUseCase } from "../../interfaces/usecase/task-comment/create-comment.js";
import { NotificationMapper } from "../../mappers/notification.js";
import type { ITaskCommentMapper } from "../../mappers/task-comment.js";
import type { IUserMapper } from "../../mappers/user/user.js";
import { CreateNotificationUseCase } from "../notification/create-notification.js";

export class CreateTaskCommentUseCase implements ICreateTaskCommentUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _userRepository: IUserRepository,
    private _taskCommentRepository: ITaskCommentRepository,
    private _userMapper: IUserMapper,
    private _taskCommentMapper: ITaskCommentMapper
  ) {}

  async execute(
    dto: ICreateTaskCommentRequestDTO
  ): Promise<ICreateTaskCommentResponseDTO> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc)
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const userDoc = await this._userRepository.findById(dto.userId);
    if (!userDoc) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const user = this._userMapper.toPublicDTO(userDoc);

    const isCreator = user.id === taskDoc.creatorId.toString();

    const payload: CreateCommentDTOWithAuthor = {
      taskId: dto.taskId,
      content: dto.content,
      isCreator,
      author: {
        id: user.id,
        name: user.name,
        ...(user.imageUrl && { imageUrl: user.imageUrl }),
      },
    };

    const persistentEntity = this._taskCommentMapper.toPersistent(payload);

    const newTaskComment =
      await this._taskCommentRepository.create(persistentEntity);

    const data = this._taskCommentMapper.toResponseDTO(newTaskComment);
    const creatorId = taskDoc.creatorId.toString();
    const assigneeId = taskDoc.assigneeId!.toString();
    const id = isCreator ? assigneeId : creatorId;
    logger.warn(`developer Id: ${id} - isCreator: ${isCreator}`);
    new CreateNotificationUseCase(
      new NotificationService(
        new NotificationRepository(NotificationModel),
        new NotificationMapper(),
        new PushService(
          new TokenRepository(TokenModel),
          new NotificationMapper()
        )
      )
    ).execute({
      userId: id,
      title: "New Comment",
      body: "User added comment",
      type: NotificationType.TASK,
    });

    new CreateNotificationUseCase(
      new NotificationService(
        new NotificationRepository(NotificationModel),
        new NotificationMapper(),
        new PushService(
          new TokenRepository(TokenModel),
          new NotificationMapper()
        )
      )
    ).execute({
      userId: dto.userId,
      title: "Gazzow Notification",
      body: "You have added a commented on task",
      type: NotificationType.TASK,
    });

    return { data };
  }
}
