import { Types, type Model } from "mongoose";
import type {
  FindWithFilter,
  IProjectRepository,
} from "../../application/interfaces/repository/project-repository.js";
import type {
  IProjectDocument,
  IProjectDocumentPopulated,
} from "../db/models/project-model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { ContributorStatus } from "../../domain/enums/project.js";
import { ApplicationStatus } from "../../domain/enums/application.js";

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
  }): Promise<FindWithFilter> {
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

    //Check project is added as favorite
    pipeline.push({
      $lookup: {
        from: "favorites",
        let: { projectId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$projectId", "$$projectId"] },
                  { $eq: ["$userId", new Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "favorite",
      },
    });

    pipeline.push({
      $addFields: {
        isFavorite: { $gt: [{ $size: "$favorite" }, 0] },
      },
    });

    pipeline.push({
      $project: {
        favorite: 0,
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

    return {
      total,
      projects,
    };
  }

  async findByCreatorWithFilter(query: {
    creatorId: string;
    search?: string;
    status?: string;
    budgetOrder?: "asc" | "desc";
    skip?: number;
    limit?: number;
  }): Promise<FindWithFilter> {
    const {
      search,
      creatorId,
      status,
      budgetOrder,
      skip = 0,
      limit = 2,
    } = query;
    const creatorObjId = new Types.ObjectId(creatorId);

    const pipeline: any[] = [{ $match: { creatorId: creatorObjId } }];

    pipeline.push({
      $sort: { createdAt: -1 },
    });

    if (search) {
      pipeline.push({
        $or: [
          { $match: { title: { $regex: search, $options: "i" } } },
          { $match: { description: { $regex: search, $options: "i" } } },
        ],
      });
    }

    if (status) {
      pipeline.push({
        $match: { status: status },
      });
    }

    if (budgetOrder) {
      pipeline.push({
        $addFields: {
          avgBudget: { $avg: ["$budgetMin", "$budgetMax"] },
        },
      });

      pipeline.push({
        $sort: { avgBudget: budgetOrder === "asc" ? 1 : -1 },
      });
    }

    const totalProjects = await this.model.aggregate([
      ...pipeline,
      {
        $count: "total",
      },
    ]);
    const total: number = totalProjects.length > 0 ? totalProjects[0].total : 0;

    const projects = await this.model.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      projects,
      total,
    };
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

  async findActiveProjects(query: {
    userId: string;
    search?: string;
    budgetOrder?: "asc" | "desc";
    skip?: number;
    limit?: number;
  }): Promise<FindWithFilter> {
    const { userId, search, budgetOrder, skip = 0, limit = 6 } = query;

    const userObjId = new Types.ObjectId(userId);

    const pipeline: any[] = [];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    if (budgetOrder) {
      pipeline.push({
        $addFields: {
          avgBudget: { $avg: ["$budgetMin", "$budgetMax"] },
        },
      });

      pipeline.push({
        $sort: { avgBudget: budgetOrder === "asc" ? 1 : -1 },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "applications",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$projectId", "$$projectId"] },
                applicantId: userObjId,
                status: ApplicationStatus.ACCEPTED,
              },
            },
          ],
          as: "application",
        },
      },
      {
        // Only show projects where the contributor has an application
        $match: { "application.0": { $exists: true } },
      }
    );

    //Check project is added as favorite
    pipeline.push({
      $lookup: {
        from: "favorites",
        let: { projectId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$projectId", "$$projectId"] },
                  { $eq: ["$userId", new Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "favorite",
      },
    });

    pipeline.push({
      $addFields: {
        isFavorite: { $gt: [{ $size: "$favorite" }, 0] },
      },
    });

    pipeline.push({
      $project: {
        favorite: 0,
      },
    });

    const projects = await this.model.aggregate([
      ...pipeline,
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const totalProjects = await this.model.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);

    const total = totalProjects.length > 0 ? totalProjects[0].total : 0;

    return {
      projects,
      total,
    };
  }

  findContributorAndUpdateStatus(
    projectId: string,
    contributorId: string,
    status: ContributorStatus
  ): Promise<IProjectDocument | null> {
    return this.model.findOneAndUpdate(
      {
        _id: projectId,
        "contributors.userId": contributorId,
      },
      {
        $set: {
          "contributors.$.status": status,
        },
      },
      {
        new: true,
      }
    );
  }

  findByProjectIds(projectIds: string[]): Promise<IProjectDocument[]> {
    const objectIds = projectIds.map((id) => new Types.ObjectId(id));
    return this.model.find({ _id: { $in: objectIds } }).exec();
  }
}
