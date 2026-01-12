import type {
  IFavoriteDocument,
  IFavoritePopulatedDocument,
} from "../../../infrastructure/db/models/favorite.model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface IFavoriteRepository
  extends IBaseRepository<IFavoriteDocument> {
  findByUserIdAndProjectId(
    userId: string,
    projectId: string
  ): Promise<IFavoriteDocument | null>;
  getUserFavorites(
    userId: string,
    skip: number,
    limit: number
  ): Promise<IFavoritePopulatedDocument[]>;
  deleteByUserIdAndFavoriteId(
    userId: string,
    projectId: string
  ): Promise<boolean>;
}
