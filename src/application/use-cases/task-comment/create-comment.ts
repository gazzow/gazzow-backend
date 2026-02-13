import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import type { IRealtimeGateway } from "../../../infrastructure/config/socket/socket-gateway.js";
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
import type { ITaskCommentMapper } from "../../mappers/task-comment.js";
import type { IUserMapper } from "../../mappers/user/user.js";

export class CreateTaskCommentUseCase implements ICreateTaskCommentUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _userRepository: IUserRepository,
    private _taskCommentRepository: ITaskCommentRepository,
    private _userMapper: IUserMapper,
    private _taskCommentMapper: ITaskCommentMapper,
    private _realtimeGateway: IRealtimeGateway,
  ) {}

  async execute(
    dto: ICreateTaskCommentRequestDTO,
  ): Promise<ICreateTaskCommentResponseDTO> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc)
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND,
      );

    const userDoc = await this._userRepository.findById(dto.userId);
    if (!userDoc) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND,
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

    logger.warn(`developer Id: ${dto.userId} - isCreator: ${isCreator}`);

    if (isCreator) {
      const assigneeMessage = {
        userId: assigneeId,
        message: "The task creator commented on the task",
        title: `Project Update`,
      };

      this._realtimeGateway.emitToUser(
        assigneeMessage.userId,
        "PROJECT_MESSAGE",
        assigneeMessage,
      );
    } else {
      const creatorMessage = {
        userId: creatorId,
        message: "The assignee commented on the task",
        title: "Gazzow Notification",
      };

      this._realtimeGateway.emitToUser(
        creatorMessage.userId,
        "PROJECT_MESSAGE",
        creatorMessage,
      );
    }

    return { data };
  }
}
