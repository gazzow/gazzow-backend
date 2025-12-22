import type { ITaskCommentDocument } from "../../../infrastructure/db/models/task-comment.model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface ITaskCommentRepository
  extends IBaseRepository<ITaskCommentDocument> {
  findByAuthorId(authorId: string): Promise<ITaskCommentDocument | null>;
}
