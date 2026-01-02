import type { IRemoveFavoriteProjectRequestDTO } from "../../../dtos/favorite.js";

export interface IRemoveFavoriteProjectUseCase {
  execute(dto: IRemoveFavoriteProjectRequestDTO): Promise<void>;
}
