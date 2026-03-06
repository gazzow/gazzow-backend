import { Types, type Model } from "mongoose";
import type { IReviewRepository } from "../../application/interfaces/repository/review.repository.js";
import type {
  IAggregatedReviewDocument,
  IReviewDocument,
} from "../db/models/review.model.js";
import { BaseRepository } from "./base/base-repository.js";

export class ReviewRepository
  extends BaseRepository<IReviewDocument>
  implements IReviewRepository
{
  constructor(model: Model<IReviewDocument>) {
    super(model);
  }

  findReviewByTaskId(taskId: string): Promise<IReviewDocument | null> {
    return this.model.findOne({ taskId });
  }

  async findReviewByContributorId(
    contributorId: string,
  ): Promise<IAggregatedReviewDocument[]> {
    return this.model.aggregate([
      {
        $match: {
          contributorId: new Types.ObjectId(contributorId),
        },
      },

      // Join reviewer (creator of review)
      {
        $lookup: {
          from: "users",
          localField: "reviewerId",
          foreignField: "_id",
          as: "reviewer",
        },
      },

      {
        $unwind: "$reviewer",
      },

      // Join task details
      {
        $lookup: {
          from: "tasks",
          localField: "taskId",
          foreignField: "_id",
          as: "task",
        },
      },

      {
        $unwind: "$task",
      },

      // Shape response
      {
        $project: {
          _id: 1,
          rating: 1,
          review: 1,
          createdAt: 1,

          reviewer: {
            id: "$reviewer._id",
            name: "$reviewer.name",
          },

          task: {
            id: "$task._id",
            title: "$task.title",
            status: "$task.status",
          },
        },
      },

      {
        $sort: { createdAt: -1 }, // latest reviews first
      },
      {
        $limit: 3
      },
    ]);
  }
}
