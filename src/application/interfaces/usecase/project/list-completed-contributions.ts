import type {
  IListCompletedContributionsRequestDTO,
  IListCompletedContributionsResponseDTO,
} from "../../../dtos/project.js";

export interface IListCompletedContributionsUseCase {
  execute(
    dto: IListCompletedContributionsRequestDTO
  ): Promise<IListCompletedContributionsResponseDTO>;
}
