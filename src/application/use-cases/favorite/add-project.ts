import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IAddProjectFavoriteRequestDTO,
  IAddProjectFavoriteResponseDTO,
} from "../../dtos/favorite.js";
import type { IFavoriteRepository } from "../../interfaces/repository/favorite.repository.js";
import type { IAddProjectFavoriteUseCase } from "../../interfaces/usecase/favorite.ts/add-project.js";
import type { IFavoriteMapper } from "../../mappers/favorite.js";

export class AddProjectFavoriteUseCase implements IAddProjectFavoriteUseCase {
  constructor(
    private _favoriteRepository: IFavoriteRepository,
    private _favoriteMapper: IFavoriteMapper
  ) {}

  async execute(
    dto: IAddProjectFavoriteRequestDTO
  ): Promise<IAddProjectFavoriteResponseDTO> {
    const projectExist =
      await this._favoriteRepository.findByUserIdAndProjectId(
        dto.userId,
        dto.projectId
      );

    if (projectExist) {
      throw new AppError(
        ResponseMessages.ProjectAlreadyAddedToFavorite,
        HttpStatusCode.OK
      );
    }

    const persistentEntity = this._favoriteMapper.toPersistentDocument(dto);
    const favoriteProject =
      await this._favoriteRepository.create(persistentEntity);

    const data = this._favoriteMapper.toResponseDTO(favoriteProject);

    return { data };
  }
}
