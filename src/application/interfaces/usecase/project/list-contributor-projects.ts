import type {
  IListContributorProjectRequestDTO,
  IListContributorProjectResponseDTO,
} from "../../../dtos/contributor.js";

export interface IListContributorProjectsUseCase {
  execute(
    dto: IListContributorProjectRequestDTO
  ): Promise<IListContributorProjectResponseDTO>;
}
