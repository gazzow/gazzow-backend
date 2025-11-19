import { Types, type Model } from "mongoose";
import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import type {
  IProjectDocument,
  IProjectDocumentPopulated,
} from "../db/models/project-model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { ContributorStatus } from "../../domain/enums/project.js";
import logger from "../../utils/logger.js";

export class ProjectRepository
  extends BaseRepository<IProjectDocument>
  implements IProjectRepository
{
  constructor(projectModel: Model<IProjectDocument>) {
    super(projectModel);
  }
  async findWithFilter(query: {
    userId: string;
    search?: string;
    experience?: string;
    budgetOrder?: "asc" | "desc";
    skip?: number;
    limit?: number;
  }): Promise<{ projects: IProjectDocument[]; total: number }> {
    const {
      userId,
      search,
      experience,
      budgetOrder,
      skip = 0,
      limit = 6,
    } = query;

    const userObjectId: Types.ObjectId = new Types.ObjectId(userId);

    const pipeline: any[] = [];

    //  Exclude user created projects
    pipeline.push({ $match: { creatorId: { $ne: userObjectId } } });

    // Exclude user as contributor
    pipeline.push({
      $match: {
        "contributors.userId": { $ne: userObjectId },
      },
    });

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            {
              title: {
                $regex: search,
                $options: "i",
              },
            },
            {
              description: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (experience) {
      pipeline.push({ $match: { experience: experience } });
    }

    pipeline.push({
      $addFields: {
        avgBudget: { $avg: ["$budgetMin", "$budgetMax"] },
      },
    });

    pipeline.push({
      $sort: {
        avgBudget: budgetOrder === "asc" ? 1 : -1,
      },
    });

    // Lookup applications to exclude applied projects
    pipeline.push({
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "projectId",
        as: "applications",
      },
    });

    pipeline.push({
      $match: {
        "applications.applicantId": { $ne: userObjectId },
      },
    });

    const projects = await this.model.aggregate([
      ...pipeline,
      {
        $skip: skip,
      },
      { $limit: limit },
    ]);

    const countResult = await this.model.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);

    const total: number = countResult.length > 0 ? countResult[0].total : 0;

    logger.debug("total value: ", total);

    return {
      total,
      projects,
    };
  }

  findByCreator(creatorId: string): Promise<IProjectDocument[] | null> {
    return this.model.find({ creatorId: new Types.ObjectId(creatorId) });
  }

  addContributor(
    projectId: string,
    userId: string,
    expectedRate: number,
    status: ContributorStatus
  ): Promise<IProjectDocument | null> {
    return this.model
      .findByIdAndUpdate(
        projectId,
        {
          $addToSet: {
            contributors: {
              userId: new Types.ObjectId(userId),
              status,
              expectedRate,
            },
          },
        },
        { new: true }
      )
      .exec();
  }

  async findContributors(
    projectId: string
  ): Promise<IProjectDocumentPopulated | null> {
    const project = await this.model
      .findById(projectId)
      .populate<{
        contributors: IProjectDocumentPopulated["contributors"];
      }>("contributors.userId", "_id name email imageUrl developerRole")
      .exec();

    return project;
  }
}
