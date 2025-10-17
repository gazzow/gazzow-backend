import { Types } from "mongoose";
import type { IApplication } from "../../domain/entities/application.js";
import type { IApplicationDocument } from "../../infrastructure/db/models/application-model.js";
import type { IApplicationRequestDTO } from "../dtos/application.js";

export interface IApplicationMapper {
  toPersistence(dto: IApplicationRequestDTO): Partial<IApplicationDocument>;
  toResponseDTO(applicationDoc: IApplicationDocument): IApplication;
}

export class ApplicationMapper implements IApplicationMapper {
  toPersistence(dto: IApplicationRequestDTO): Partial<IApplicationDocument> {
    return {
      projectId: new Types.ObjectId(dto.projectId),
      applicantId: new Types.ObjectId(dto.applicantId),
      expectedRate: dto.expectedRate,
      proposal: dto?.proposal,
    };
  }

  toResponseDTO(applicationDoc: IApplicationDocument): IApplication {
    return {
      id: applicationDoc._id.toString(),
      projectId: applicationDoc.projectId.toString(),
      applicantId: applicationDoc.applicantId.toString(),
      expectedRate: applicationDoc.expectedRate,
      status: applicationDoc.status,
      proposal: applicationDoc?.proposal,
      createdAt:
        applicationDoc.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt:
        applicationDoc.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  }
}
