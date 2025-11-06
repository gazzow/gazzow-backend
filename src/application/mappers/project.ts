import { Types } from "mongoose";
import type {
  ICreateProjectRequestDTO,
  IListContributorsResponseDTO,
} from "../dtos/project.js";
import type {
  IProjectDocument,
  IProjectDocumentPopulated,
} from "../../infrastructure/db/models/project-model.js";
import type { IProject } from "../../domain/entities/project.js";

export interface IProjectMapper {
  toPersistenceEntity(dto: ICreateProjectRequestDTO): Partial<IProjectDocument>;
  toResponseDTO(projectDoc: IProjectDocument): IProject;
  toUpdateProjectEntity(dto: Partial<IProject>): Partial<IProjectDocument>;
  toListContributorsResponseDTO(
    doc: IProjectDocumentPopulated
  ): IListContributorsResponseDTO;
}

export class ProjectMapper implements IProjectMapper {
  toPersistenceEntity(
    dto: ICreateProjectRequestDTO
  ): Partial<IProjectDocument> {
    return {
      title: dto.title,
      creatorId: new Types.ObjectId(dto.creatorId),
      description: dto.description,
      budgetMin: dto.budgetMin,
      budgetMax: dto.budgetMax,
      requiredSkills: dto.requiredSkills,
      experience: dto.experience,
      developersNeeded: dto.developersNeeded,
      documents: dto.documents,
      durationMin: dto.durationMin,
      durationMax: dto.durationMax,
      durationUnit: dto.durationUnit,
      visibility: dto.visibility,
      status: dto.status,
    };
  }

  toResponseDTO(projectDoc: IProjectDocument): IProject {
    return {
      id: projectDoc._id.toString(),
      creatorId: projectDoc.creatorId.toString(),
      title: projectDoc.title,
      description: projectDoc.description,
      developersNeeded: projectDoc.developersNeeded,
      experience: projectDoc.experience,
      contributors: projectDoc.contributors.map((c) => ({
        userId: c.userId.toString(),
        status: c.status,
        invitedAt: c.invitedAt?.toISOString() ?? "",
        createdAt: c.createdAt?.toISOString() ?? "",
        updatedAt: projectDoc.updatedAt?.toISOString() ?? "",
      })),
      budgetMin: projectDoc.budgetMin,
      budgetMax: projectDoc.budgetMax,
      requiredSkills: projectDoc.requiredSkills,
      durationMin: projectDoc.durationMin,
      durationMax: projectDoc.durationMax,
      durationUnit: projectDoc.durationUnit,
      visibility: projectDoc.visibility,
      status: projectDoc.status,
      documents: projectDoc.documents,
      createdAt: projectDoc.createdAt?.toISOString() ?? "",
      updatedAt: projectDoc.updatedAt?.toISOString() ?? "",
    };
  }

  toUpdateProjectEntity(dto: Partial<IProject>): Partial<IProjectDocument> {
    const { id, creatorId, createdAt, contributors, ...fields } = dto;

    const updateData: Partial<IProjectDocument> = {};

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        (updateData as any)[key] = value;
      }
    });

    return updateData;
  }
  toListContributorsResponseDTO(
    doc: IProjectDocumentPopulated
  ): IListContributorsResponseDTO {
    return {
      projectId: doc._id.toString(),
      title: doc.title,
      contributors: doc.contributors.map((contributor) => ({
        id: contributor._id.toString(),
        userId: contributor.userId._id.toString(),
        name: contributor.userId.name,
        email: contributor.userId.email,
        imageUrl: contributor.userId.imageUrl,
        developerRole: contributor.userId.developerRole,
        status: contributor.status,
        expectedRate: contributor.expectedRate,
        invitedAt: contributor.invitedAt?.toISOString?.() ?? "",
        createdAt: contributor.createdAt?.toISOString?.() ?? "",
        updatedAt: contributor.updatedAt?.toISOString?.() ?? "",
      })),
    };
  }
}
