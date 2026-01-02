import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type { IRemoveFavoriteProjectRequestDTO } from "../../dtos/favorite.js";
import type { IFavoriteRepository } from "../../interfaces/repository/favorite.repository.js";
import type { IRemoveFavoriteProjectUseCase } from "../../interfaces/usecase/favorite.ts/remove-favorite.js";

export class RemoveFavoriteProjectUseCase
  implements IRemoveFavoriteProjectUseCase
{
  constructor(private _favoriteRepository: IFavoriteRepository) {}

  async execute(dto: IRemoveFavoriteProjectRequestDTO): Promise<void> {
    const isDeleted =
      await this._favoriteRepository.deleteByUserIdAndFavoriteId(
        dto.userId,
        dto.projectId
      );

    if (!isDeleted) {
      throw new AppError(
        ResponseMessages.FavoriteNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }
  }
}
