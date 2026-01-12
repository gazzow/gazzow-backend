  import { Types } from "mongoose";
import type { ITaskComment } from "../../domain/entities/task-comment.js";
import type { ITaskCommentDocument } from "../../infrastructure/db/models/task-comment.model.js";
import type {
  CreateCommentDTOWithAuthor,
} from "../dtos/task-comment.js";

export interface ITaskCommentMapper {
  toPersistent(dto: CreateCommentDTOWithAuthor): Partial<ITaskCommentDocument>;
  toDomain(doc: ITaskCommentDocument): ITaskComment;
  toResponseDTO(doc: ITaskCommentDocument): ITaskComment;
  toGetCommentsPersistent(taskId: string): Partial<ITaskCommentDocument>;
}

export class TaskCommentMapper implements ITaskCommentMapper {
  toPersistent(dto: CreateCommentDTOWithAuthor): Partial<ITaskCommentDocument> {
    return {
      taskId: new Types.ObjectId(dto.taskId),
      content: dto.content,
      isCreator: dto.isCreator,
      author: {
        id: new Types.ObjectId(dto.author.id),
        name: dto.author.name,
        ...(dto.author.imageUrl && { imageUrl: dto.author.imageUrl }),
      },
    };
  }
  toDomain(doc: ITaskCommentDocument): ITaskComment {
    return {
      id: doc._id.toString(),
      taskId: doc.taskId.toString(),
      content: doc.content,
      author: {
        id: doc.author.id.toString(),
        name: doc.author.name,
        ...(doc.author.imageUrl && { imageUrl: doc.author.imageUrl }),
      },
      isCreator: doc.isCreator,
      isDeleted: doc.isDeleted,
      isEdited: doc.isEdited,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
  toResponseDTO(doc: ITaskCommentDocument): ITaskComment {
    return {
      id: doc._id.toString(),
      taskId: doc.taskId.toString(),
      content: doc.content,
      author: {
        id: doc.author.id.toString(),
        name: doc.author.name,
        ...(doc.author.imageUrl && { imageUrl: doc.author.imageUrl }),
      },
      isCreator: doc.isCreator,
      isDeleted: doc.isDeleted,
      isEdited: doc.isEdited,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
  toGetCommentsPersistent(taskId: string): Partial<ITaskCommentDocument> {
    return {
      taskId: new Types.ObjectId(taskId),
    };
  }
}
