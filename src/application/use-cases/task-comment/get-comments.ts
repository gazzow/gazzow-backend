import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IGetTaskCommentsRequestDTO,
  IGetTaskCommentsResponseDTO,
} from "../../dtos/task-comment.js";
import type { ITaskCommentRepository } from "../../interfaces/repository/task-comment.repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IGetTaskCommentsUseCase } from "../../interfaces/usecase/task-comment/get-comments.js";
import type { ITaskCommentMapper } from "../../mappers/task-comment.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class GetTaskCommentsUseCase implements IGetTaskCommentsUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskCommentRepository: ITaskCommentRepository,
    private _taskMapper: ITaskMapper,
    private _taskCommentMapper: ITaskCommentMapper,
  ) {}
  async execute(
    dto: IGetTaskCommentsRequestDTO,
  ): Promise<IGetTaskCommentsResponseDTO> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc)
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    const task = this._taskMapper.toResponseDTO(taskDoc);

    const persistentEntity = this._taskCommentMapper.toGetCommentsPersistent(
      task.id,
    );

    const taskCommentDocs = await this._taskCommentRepository.findAll({
      filter: persistentEntity,
      limit: 0,
    });

    const taskComments = taskCommentDocs.map((comments) => {
      return this._taskCommentMapper.toResponseDTO(comments);
    });

    return {
      data: taskComments,
    };
  }
}
