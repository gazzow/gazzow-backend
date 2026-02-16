import { Types, type Model } from "mongoose";
import { BaseRepository } from "./base/base-repository.js";
import type { IFavoriteRepository } from "../../application/interfaces/repository/favorite.repository.js";
import type {
  IFavoriteDocument,
  IFavoritePopulatedDocument,
} from "../db/models/favorite.model.js";

export class FavoriteRepository
  extends BaseRepository<IFavoriteDocument>
  implements IFavoriteRepository
{
  constructor(model: Model<IFavoriteDocument>) {
    super(model);
  }

  findByUserIdAndProjectId(
    userId: string,
    projectId: string,
  ): Promise<IFavoriteDocument | null> {
    return this.model.findOne({ userId, projectId });
  }

  async getUserFavorites(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<IFavoritePopulatedDocument[]> {
    const userObjectId = new Types.ObjectId(userId);

    const pipeline: any[] = [
      {
        $match: { userId: userObjectId },
      },

      // Join Project
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },

      { $unwind: "$project" },

      {
        $match: {
          "project.isDeleted": false,
        },
      },

      // Application Count
      {
        $lookup: {
          from: "applications",
          let: { projectId: "$project._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$projectId", "$$projectId"],
                },
              },
            },
            { $count: "count" },
          ],
          as: "applicationCount",
        },
      },

      {
        $addFields: {
          "project.applicationCount": {
            $ifNull: [{ $arrayElemAt: ["$applicationCount.count", 0] }, 0],
          },
        },
      },

      // Creator Info
      {
        $lookup: {
          from: "users",
          let: { creatorId: "$project.creatorId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$creatorId"] },
              },
            },
            {
              $project: {
                name: 1,
                imageUrl: 1,
              },
            },
          ],
          as: "creator",
        },
      },

      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          "project.creator": "$creator",
          "project.isFavorite": true,
        },
      },

      {
        $project: {
          applicationCount: 0,
          creator: 0,
        },
      },

      {
        $sort: { createdAt: -1 }, // Favorite createdAt (not project)
      },

      { $skip: skip },
      { $limit: limit },
    ];

    return await this.model.aggregate(pipeline);
  }

  async deleteByUserIdAndFavoriteId(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    const result = await this.model.deleteOne({ userId, projectId });

    return result.deletedCount === 1;
  }
}
