import type {
  ICreateTaskCommentRequestDTO,
  ICreateTaskCommentResponseDTO,
} from "../../../dtos/task-comment.js";

export interface ICreateTaskCommentUseCase {
  execute(
    dto: ICreateTaskCommentRequestDTO
  ): Promise<ICreateTaskCommentResponseDTO>;
}
