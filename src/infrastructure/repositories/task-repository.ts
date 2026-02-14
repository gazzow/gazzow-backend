import { Types, type FilterQuery, type Model } from "mongoose";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type {
  IPopulatedTaskDocument,
  ITaskDocument,
} from "../db/models/task-model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { IProjectDocument } from "../db/models/project-model.js";
import type { IUserDocument } from "../db/models/user-model.js";
import type { ITaskStatistics } from "../../application/dtos/task.js";
import { TaskPaymentStatus, TaskStatus } from "../../domain/enums/task.js";

export class TaskRepository
  extends BaseRepository<ITaskDocument>
  implements ITaskRepository
{
  constructor(model: Model<ITaskDocument>) {
    super(model);
  }
  findByAssigneeId(
    projectId: string,
    assigneeId: string,
  ): Promise<ITaskDocument[] | null> {
    return this.model.find({ assigneeId, projectId });
  }
  async findByProjectAndUser(query: {
    filter?: FilterQuery<ITaskDocument>;
    skip?: number;
    limit?: number;
  }): Promise<IPopulatedTaskDocument[]> {
    const { filter = {}, skip = 0, limit = 10 } = query;

    return this.model
      .find(filter)
      .populate<{ projectId: IProjectDocument }>("projectId")
      .populate<{ assigneeId: IUserDocument }>("assigneeId")
      .populate<{ creatorId: IUserDocument }>("creatorId")
      .skip(skip)
      .limit(limit)
      .exec();
  }

  findByIdAndPopulate(taskId: string): Promise<IPopulatedTaskDocument | null> {
    return this.model
      .findById(taskId)
      .populate<{ projectId: IProjectDocument }>("projectId")
      .populate<{ assigneeId: IUserDocument }>("assigneeId")
      .populate<{ creatorId: IUserDocument }>("creatorId")
      .exec();
  }

  async getTaskStatusOverview(assigneeId: string): Promise<ITaskStatistics[]> {
    return await this.model.aggregate([
      {
        $match: {
          assigneeId: new Types.ObjectId(assigneeId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },
    ]);
  }

  getCompletedTaskByAssigneeId(assigneeId: string): Promise<ITaskDocument[]> {
    return this.model
      .find({
        assigneeId: new Types.ObjectId(assigneeId),
        status: TaskStatus.COMPLETED,
        paymentStatus: TaskPaymentStatus.PAID,
        isDeleted: false,
      })
      .exec();
  }

  async existsActiveTask(projectId: string): Promise<boolean> {
    return this.model
      .exists({
        projectId: new Types.ObjectId(projectId),
        status: {
          $in: [
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
            TaskStatus.SUBMITTED,
            TaskStatus.REVISIONS_REQUESTED,
          ],
        },
        isDeleted: false,
      })
      .then((result) => !!result);
  }
}
