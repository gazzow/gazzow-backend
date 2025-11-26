import { Types } from "mongoose";
import type {
  IApplication,
  IApplicationDocumentWithApplicant,
  IApplicationWithApplicant,
  IApplicationWithPopulatedProject,
} from "../../domain/entities/application.js";
import type {
  IApplicationDocument,
  IApplicationPopulatedProjectDocument,
} from "../../infrastructure/db/models/application-model.js";
import type { IApplicationRequestDTO } from "../dtos/application.js";

export interface IApplicationMapper {
  toPersistence(dto: IApplicationRequestDTO): Partial<IApplicationDocument>;
  toResponseDTO(applicationDoc: IApplicationDocument): IApplication;
  toResponseWithApplicantDTO(
    applicationDoc: IApplicationDocumentWithApplicant
  ): IApplicationWithApplicant;

  toResponseWithProjectDTO(
    applicationDocs: IApplicationPopulatedProjectDocument
  ): IApplicationWithPopulatedProject;
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

  toResponseWithApplicantDTO(
    applicationDoc: IApplicationDocumentWithApplicant
  ): IApplicationWithApplicant {
    return {
      id: applicationDoc._id.toString(),
      projectId: applicationDoc.projectId.toString(),
      applicantId: applicationDoc.applicantId.toString(),
      applicant: applicationDoc.applicant,
      expectedRate: applicationDoc.expectedRate,
      status: applicationDoc.status,
      proposal: applicationDoc?.proposal,
      createdAt:
        applicationDoc.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt:
        applicationDoc.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  }

  toResponseWithProjectDTO(
    applicationDocs: IApplicationPopulatedProjectDocument
  ): IApplicationWithPopulatedProject {
    return {
      id: applicationDocs._id.toString(),
      applicantId: applicationDocs.applicantId.toString(),
      expectedRate: applicationDocs.expectedRate,
      status: applicationDocs.status,
      proposal: applicationDocs?.proposal,
      createdAt:
        applicationDocs.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt:
        applicationDocs.updatedAt?.toISOString() ?? new Date().toISOString(),
      projectId: {
        id: applicationDocs.projectId?._id?.toString(),
        title: applicationDocs.projectId?.title,
        description: applicationDocs.projectId?.description,
        budgetMin: applicationDocs.projectId?.budgetMin,
        budgetMax: applicationDocs.projectId?.budgetMax,
        durationMin: applicationDocs.projectId?.durationMin,
        durationMax: applicationDocs.projectId?.durationMax,
        durationUnit: applicationDocs.projectId?.durationUnit,
      },
    };
  }
}
