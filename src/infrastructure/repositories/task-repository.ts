import type { FilterQuery, Model } from "mongoose";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type {
  IPopulatedTaskDocument,
  ITaskDocument,
} from "../db/models/task-model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { IProjectDocument } from "../db/models/project-model.js";
import type { IUserDocument } from "../db/models/user-model.js";

export class TaskRepository
  extends BaseRepository<ITaskDocument>
  implements ITaskRepository
{
  constructor(model: Model<ITaskDocument>) {
    super(model);
  }
  findByAssigneeId(assigneeId: string): Promise<ITaskDocument[] | null> {
    return this.model.find({ assigneeId });
  }
  async findByProjectAndUser(query: {
    filter?: FilterQuery<ITaskDocument>;
    skip?: number;
    limit?: number;
  }): Promise<IPopulatedTaskDocument[]> {
    const { filter = {}, skip = 0, limit = 10 } = query;

    return await this.model
      .find(filter)
      .populate<{ projectId: IProjectDocument }>("projectId")
      .populate<{ assigneeId: IUserDocument }>("assigneeId")
      .populate<{ creatorId: IUserDocument }>("creatorId")
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
