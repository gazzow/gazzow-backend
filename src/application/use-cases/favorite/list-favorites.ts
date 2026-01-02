import type {
  IListFavoriteProjectsRequestDTO,
  IListFavoriteProjectsResponseDTO,
} from "../../dtos/favorite.js";
import type { IFavoriteRepository } from "../../interfaces/repository/favorite.repository.js";
import type { IListFavoriteProjectsUseCase } from "../../interfaces/usecase/favorite.ts/list-favorites.js";
import type { IFavoriteMapper } from "../../mappers/favorite.js";

export class ListFavoriteProjectsUseCase
  implements IListFavoriteProjectsUseCase
{
  constructor(
    private _favoriteRepository: IFavoriteRepository,
    private _favoriteMapper: IFavoriteMapper
  ) {}
  async execute(
    dto: IListFavoriteProjectsRequestDTO
  ): Promise<IListFavoriteProjectsResponseDTO> {
    const favoriteDocs = await this._favoriteRepository.getUserFavorites(
      dto.userId
    );

    const data = favoriteDocs.map((fav) =>
      this._favoriteMapper.toPopulatedResponseDTO(fav)
    );

    return { data };
  }
}
