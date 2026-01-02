import type {
  IAddProjectFavoriteRequestDTO,
  IAddProjectFavoriteResponseDTO,
} from "../../../dtos/favorite.js";

export interface IAddProjectFavoriteUseCase {
  execute(
    dto: IAddProjectFavoriteRequestDTO
  ): Promise<IAddProjectFavoriteResponseDTO>;
}
