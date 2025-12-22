import type { ITaskComment } from "../../domain/entities/task-comment.js";

export interface ICreateTaskCommentRequestDTO {
  userId: string;
  taskId: string;
  content: string;
}

export interface CreateCommentDTOWithAuthor {
  taskId: string;
  content: string;
  isCreator: boolean;
  author: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

export interface ICreateTaskCommentResponseDTO {
  data: ITaskComment;
}

export interface IGetTaskCommentsRequestDTO {
  taskId: string;
}

export interface IGetTaskCommentsResponseDTO {
  data: ITaskComment[];
}
