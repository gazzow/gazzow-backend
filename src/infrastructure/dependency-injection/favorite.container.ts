import type { IFavoriteRepository } from "../../application/interfaces/repository/favorite.repository.js";
import type { IAddProjectFavoriteUseCase } from "../../application/interfaces/usecase/favorite.ts/add-project.js";
import type { IListFavoriteProjectsUseCase } from "../../application/interfaces/usecase/favorite.ts/list-favorites.js";
import type { IRemoveFavoriteProjectUseCase } from "../../application/interfaces/usecase/favorite.ts/remove-favorite.js";
import {
  FavoriteMapper,
  type IFavoriteMapper,
} from "../../application/mappers/favorite.js";
import { AddProjectFavoriteUseCase } from "../../application/use-cases/favorite/add-project.js";
import { ListFavoriteProjectsUseCase } from "../../application/use-cases/favorite/list-favorites.js";
import { RemoveFavoriteProjectUseCase } from "../../application/use-cases/favorite/remove-favorite.js";
import { FavoriteController } from "../../presentation/controllers/favorite.controller.js";
import { FavoriteModel } from "../db/models/favorite.model.js";
import { FavoriteRepository } from "../repositories/favorite.repository.js";

export class FavoriteDependencyContainer {
  private readonly _favoriteRepository: IFavoriteRepository;
  private readonly _favoriteMapper: IFavoriteMapper;

  constructor() {
    this._favoriteRepository = new FavoriteRepository(FavoriteModel);
    this._favoriteMapper = new FavoriteMapper();
  }

  private createAddProjectFavoriteUseCase(): IAddProjectFavoriteUseCase {
    return new AddProjectFavoriteUseCase(
      this._favoriteRepository,
      this._favoriteMapper
    );
  }

  private createListFavoritesUseCase(): IListFavoriteProjectsUseCase {
    return new ListFavoriteProjectsUseCase(
      this._favoriteRepository,
      this._favoriteMapper
    );
  }
  private createRemoveFavorite(): IRemoveFavoriteProjectUseCase {
    return new RemoveFavoriteProjectUseCase(this._favoriteRepository);
  }

  // Favorite Controller
  createFavoriteController(): FavoriteController {
    return new FavoriteController(
      this.createAddProjectFavoriteUseCase(),
      this.createListFavoritesUseCase(),
      this.createRemoveFavorite()
    );
  }
}
