import type { Model } from "mongoose";
import { BaseRepository } from "./base/base-repository.js";
import type { IFavoriteRepository } from "../../application/interfaces/repository/favorite.repository.js";
import type {
  IFavoriteDocument,
  IFavoritePopulatedDocument,
} from "../db/models/favorite.model.js";
import type { IProjectDocument } from "../db/models/project-model.js";

export class FavoriteRepository
  extends BaseRepository<IFavoriteDocument>
  implements IFavoriteRepository
{
  constructor(model: Model<IFavoriteDocument>) {
    super(model);
  }

  findByUserIdAndProjectId(
    userId: string,
    projectId: string
  ): Promise<IFavoriteDocument | null> {
    return this.model.findOne({ userId, projectId });
  }

  async getUserFavorites(
    userId: string
  ): Promise<IFavoritePopulatedDocument[]> {
    const favorites = await this.model
      .find({ userId })
      .populate<{ projectId: IProjectDocument }>("projectId")
      .sort({ createdAt: -1 })
      .exec();

    return favorites;
  }

  async deleteByUserIdAndFavoriteId(
    userId: string,
    projectId: string
  ): Promise<boolean> {
    const result = await this.model.deleteOne({ userId, projectId });

    return result.deletedCount === 1;
  }
}
