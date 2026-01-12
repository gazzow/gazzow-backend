import type {
  IListFavoriteProjectsRequestDTO,
  IListFavoriteProjectsResponseDTO,
} from "../../../dtos/favorite.js";

export interface IListFavoriteProjectsUseCase {
  execute(
    dto: IListFavoriteProjectsRequestDTO
  ): Promise<IListFavoriteProjectsResponseDTO>;
}
