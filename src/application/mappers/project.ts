import { Types } from "mongoose";
import type { ICreateProjectRequestDTO } from "../dtos/project.js";
import type { IProjectDocument } from "../../infrastructure/db/models/project-model.js";
import type { IProject } from "../../domain/entities/project.js";

export interface IProjectMapper {
  toPersistenceEntity(dto: ICreateProjectRequestDTO): Partial<IProjectDocument>;
  toResponseDTO(projectDoc: IProjectDocument): IProject;
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
      contributors: [],
      durationMin: dto.durationMin,
      durationMax: dto.durationMax,
      durationUnit: dto.durationUnit,
      visibility: dto.visibility,
      status: dto.status,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      createdAt: projectDoc.createdAt?.toISOString() ?? "",
      updatedAt: projectDoc.updatedAt?.toISOString() ?? "",
    };
  }
}
