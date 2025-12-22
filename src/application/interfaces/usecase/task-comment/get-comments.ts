import type {
  IGetTaskCommentsRequestDTO,
  IGetTaskCommentsResponseDTO,
} from "../../../dtos/task-comment.js";

export interface IGetTaskCommentsUseCase {
  execute(
    dto: IGetTaskCommentsRequestDTO
  ): Promise<IGetTaskCommentsResponseDTO>;
}


