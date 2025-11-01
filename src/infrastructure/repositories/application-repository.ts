import { Types, type Model } from "mongoose";
import type { IApplicationRepository } from "../../application/interfaces/repository/application-repository.js";
import type { IApplicationDocument } from "../db/models/application-model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { IApplicationDocumentWithApplicant } from "../../domain/entities/application.js";
import { ApplicationStatus } from "../../domain/enums/application.js";

export class ApplicationRepository
  extends BaseRepository<IApplicationDocument>
  implements IApplicationRepository
{
  constructor(applicationModel: Model<IApplicationDocument>) {
    super(applicationModel);
  }

  findByProjectId(
    projectId: string
  ): Promise<IApplicationDocumentWithApplicant[] | null> {
    return this.model.aggregate([
      {
        $match: {
          projectId: new Types.ObjectId(projectId),
          status: ApplicationStatus.PENDING,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "applicantId",
          foreignField: "_id",
          as: "applicant",
          pipeline: [
            {
              $project: {
                name: 1,
                developerRole: 1,
                techStacks: 1,
                experience: 1,
                imageUrl: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$applicant" },
      {
        $project: {
          _id: 1,
          id: "$_id",
          projectId: 1,
          applicantId: 1,
          applicant: 1,
          expectedRate: 1,
          status: 1,
          proposal: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }

  findByApplicantAndProject(
    applicantId: string,
    projectId: string
  ): Promise<IApplicationDocument | null> {
    return this.model.findOne({ applicantId, projectId });
  }

  updateStatus(
    applicationId: string,
    status: ApplicationStatus
  ): Promise<IApplicationDocument | null> {
    return this.model
      .findByIdAndUpdate(applicationId, { status }, { new: true })
      .exec();
  }
}
