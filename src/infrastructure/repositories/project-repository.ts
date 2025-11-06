import { Types, type Model } from "mongoose";
import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import type {
  IProjectDocument,
  IProjectDocumentPopulated,
} from "../db/models/project-model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { ContributorStatus } from "../../domain/enums/project.js";

export class ProjectRepository
  extends BaseRepository<IProjectDocument>
  implements IProjectRepository
{
  constructor(projectModel: Model<IProjectDocument>) {
    super(projectModel);
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
            contributors: { userId: new Types.ObjectId(userId), status, expectedRate },
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
