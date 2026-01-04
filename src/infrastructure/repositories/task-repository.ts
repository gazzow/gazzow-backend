import type { FilterQuery, Model } from "mongoose";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type {
  IPopulatedTaskDocument,
  ITaskDocument,
} from "../db/models/task-model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { IProjectDocument } from "../db/models/project-model.js";
import type { IUserDocument } from "../db/models/user-model.js";
import type { IMonthlyRevenue } from "../../application/dtos/admin/dashboard.js";

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

  async getMonthlyPlatformRevenue(): Promise<IMonthlyRevenue[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          status: "completed",
          paymentStatus: "paid",
          paidAt: { $exists: true },
          isDeleted: false,
        },
      },
      {
        $project: {
          month: { $month: "$paidAt" },
          year: { $year: "$paidAt" },
          platformAmount: {
            $subtract: [
              { $subtract: ["$totalAmount", "$balance"] },
              { $ifNull: ["$refundAmount", 0] },
            ],
          },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          revenue: { $sum: "$platformAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return result.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      revenue: item.revenue,
    }));
  }
}
