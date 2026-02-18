import { Types } from "mongoose";
import type { IFavorite } from "../../domain/entities/favorite.js";
import type {
  IFavoriteDocument,
  IFavoritePopulatedDocument,
} from "../../infrastructure/db/models/favorite.model.js";
import type {
  IAddProjectFavoriteRequestDTO,
  IFavoriteResponseDTO,
} from "../dtos/favorite.js";

export interface IFavoriteMapper {
  toPersistentDocument(
    dto: IAddProjectFavoriteRequestDTO,
  ): Partial<IFavoriteDocument>;
  toPopulatedResponseDTO(
    projectDoc: IFavoritePopulatedDocument,
  ): IFavoriteResponseDTO;
  toResponseDTO(doc: IFavoriteDocument): IFavorite;
}

export class FavoriteMapper implements IFavoriteMapper {
  toPersistentDocument(
    dto: IAddProjectFavoriteRequestDTO,
  ): Partial<IFavoriteDocument> {
    return {
      userId: new Types.ObjectId(dto.userId),
      projectId: new Types.ObjectId(dto.projectId),
    };
  }

  toResponseDTO(doc: IFavoriteDocument): IFavorite {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      projectId: doc.projectId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  toPopulatedResponseDTO(
    projectDoc: IFavoritePopulatedDocument,
  ): IFavoriteResponseDTO {
    return {  
      id: projectDoc._id.toString(),
      userId: projectDoc.userId.toString(),
      project: {
        id: projectDoc.project._id.toString(),
        creatorId: projectDoc.project.creatorId.toString(),
        creator: projectDoc.project.creator,
        title: projectDoc.project.title,
        description: projectDoc.project.description,
        developersNeeded: projectDoc.project.developersNeeded,
        experience: projectDoc.project.experience,
        contributors: projectDoc.project.contributors.map((c) => ({
          userId: c.userId.toString(),
          status: c.status,
          invitedAt: c.invitedAt?.toISOString() ?? "",
          createdAt: c.createdAt?.toISOString() ?? "",
          updatedAt: projectDoc.project.updatedAt?.toISOString() ?? "",
        })),
        budgetMin: projectDoc.project.budgetMin,
        budgetMax: projectDoc.project.budgetMax,
        requiredSkills: projectDoc.project.requiredSkills,
        durationMin: projectDoc.project.durationMin,
        durationMax: projectDoc.project.durationMax,
        durationUnit: projectDoc.project.durationUnit,
        visibility: projectDoc.project.visibility,
        applicationCount: projectDoc.project.applicationCount,
        isFavorite: projectDoc.project.isFavorite,
        status: projectDoc.project.status,
        documents: projectDoc.project.documents,
        isDeleted: projectDoc.project.isDeleted,
        deletedAt: projectDoc.project.deletedAt,
        createdAt: projectDoc.project.createdAt?.toISOString() ?? "",
        updatedAt: projectDoc.project.updatedAt?.toISOString() ?? "",
      },
      createdAt: projectDoc.project.createdAt,
      updatedAt: projectDoc.project.updatedAt,
    };
  }
}
