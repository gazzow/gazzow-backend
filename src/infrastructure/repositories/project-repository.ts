import { Types, type Model } from "mongoose";
import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import type { IProjectDocument } from "../db/models/project-model.js";
import { BaseRepository } from "./base/base-repository.js";

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
}
