import type { Model } from "mongoose";
import type { IApplicationRepository } from "../../application/interfaces/repository/application-repository.js";
import type { IApplicationDocument } from "../db/models/application-model.js";
import { BaseRepository } from "./base/base-repository.js";

export class ApplicationRepository
  extends BaseRepository<IApplicationDocument>
  implements IApplicationRepository
{
  constructor(applicationModel: Model<IApplicationDocument>) {
    super(applicationModel);
  }

  findByProjectId(projectId: string): Promise<IApplicationDocument[] | null> {
    return this.model.find({ projectId: projectId }).exec();
  }

  findByApplicantAndProject(
    applicantId: string,
    projectId: string
  ): Promise<IApplicationDocument | null> {
    return this.model.findOne({ applicantId, projectId });
  }
}
