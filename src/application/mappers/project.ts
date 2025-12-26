import { Types } from "mongoose";
import type {
  ICreateProjectRequestDTO,
  IListContributorsResponseDTO,
} from "../dtos/project.js";
import type {
  IPopulatedContributor,
  IProjectDocument,
  IProjectDocumentPopulated,
} from "../../infrastructure/db/models/project-model.js";
import type { Contributor, IProject } from "../../domain/entities/project.js";

export interface IProjectMapper {
  toPersistenceEntity(dto: ICreateProjectRequestDTO): Partial<IProjectDocument>;
  toResponseDTO(projectDoc: IProjectDocument): IProject;
  toUpdateProjectEntity(dto: Partial<IProject>): Partial<IProjectDocument>;
  toListContributorsResponseDTO(
    doc: IProjectDocumentPopulated
  ): IListContributorsResponseDTO;

  toDomain(projectDoc: IProjectDocument): IProject;

  toListContributorsEntity(
    populatedContributor: IPopulatedContributor
  ): Contributor;
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

  toDomain(projectDoc: IProjectDocument): IProject {
    return {
      id: projectDoc._id.toString(),
      creatorId: projectDoc.creatorId.toString(),
      title: projectDoc.title,
      description: projectDoc.description,
      developersNeeded: projectDoc.developersNeeded,
      experience: projectDoc.experience,
      contributors:
        projectDoc.contributors.length > 0
          ? projectDoc.contributors.map((c) => ({
              userId: c.userId.toString(),
              status: c.status,
              invitedAt: c.invitedAt?.toISOString() ?? "",
              createdAt: c.createdAt?.toISOString() ?? "",
              updatedAt: projectDoc.updatedAt?.toISOString() ?? "",
            }))
          : [],
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
    const update: Partial<IProjectDocument> = {};

    if (dto.title) update.title = dto.title;

    if (dto.description) update.description = dto.description;

    if (dto.requiredSkills) update.requiredSkills = dto.requiredSkills;

    if (dto.experience) update.experience = dto.experience;

    if (dto.budgetMin) update.budgetMin = dto.budgetMin;

    if (dto.budgetMax) update.budgetMax = dto.budgetMax;

    if (dto.durationMin) update.durationMin = dto.durationMin;

    if (dto.durationMax) update.durationMax = dto.durationMax;

    if (dto.durationUnit) update.durationUnit = dto.durationUnit;

    return update;
  }
  toListContributorsResponseDTO(
    doc: IProjectDocumentPopulated
  ): IListContributorsResponseDTO {
    return {
      projectId: doc._id.toString(),
      title: doc.title,
      contributors: doc.contributors.map((contributor) => ({
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

  toListContributorsEntity(
    populatedContributor: IPopulatedContributor
  ): Contributor {
    return {
      id: populatedContributor.userId._id.toString(),
      name: populatedContributor.userId.name,
      email: populatedContributor.userId.name,
      imageUrl: populatedContributor.userId.imageUrl,
      developerRole: populatedContributor.userId.developerRole,
      expectedRate: populatedContributor.expectedRate,
      status: populatedContributor.status,
      invitedAt: populatedContributor.invitedAt?.toISOString?.() ?? "",
      createdAt: populatedContributor.createdAt?.toISOString?.() ?? "",
      updatedAt: populatedContributor.updatedAt?.toISOString?.() ?? "",
    };
  }
}
