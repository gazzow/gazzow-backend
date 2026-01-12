import type { Model } from "mongoose";
import type { ITaskCommentRepository } from "../../application/interfaces/repository/task-comment.repository.js";
import type { ITaskCommentDocument } from "../db/models/task-comment.model.js";
import { BaseRepository } from "./base/base-repository.js";

export class TaskCommentRepository
  extends BaseRepository<ITaskCommentDocument>
  implements ITaskCommentRepository
{
  constructor(model: Model<ITaskCommentDocument>) {
    super(model);
  }
  findByAuthorId(authorId: string): Promise<ITaskCommentDocument | null> {
    return this.model.findOne({ "author.id": authorId });
  }
}
