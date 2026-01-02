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
    dto: IAddProjectFavoriteRequestDTO
  ): Partial<IFavoriteDocument>;
  toPopulatedResponseDTO(doc: IFavoritePopulatedDocument): IFavoriteResponseDTO;
  toResponseDTO(doc: IFavoriteDocument): IFavorite;
}

export class FavoriteMapper implements IFavoriteMapper {
  toPersistentDocument(
    dto: IAddProjectFavoriteRequestDTO
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
    doc: IFavoritePopulatedDocument
  ): IFavoriteResponseDTO {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      project: {
        ...(doc.projectId.id && { id: doc.projectId.id }),
        title: doc.projectId?.title,
        description: doc.projectId.description,
        requiredSkills:doc.projectId.requiredSkills,
        budgetMin: doc.projectId.budgetMin,
        budgetMax: doc.projectId.budgetMax,
        durationMin: doc.projectId.durationMin,
        durationMax: doc.projectId.durationMax,
        durationUnit: doc.projectId.durationUnit,
      },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
