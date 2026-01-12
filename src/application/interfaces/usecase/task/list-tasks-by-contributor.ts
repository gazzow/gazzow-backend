import type {
  IListTasksByContributorRequestDTO,
  IPopulatedResponseDTO,
} from "../../../dtos/task.js";

export interface IListTasksByContributorUseCase {
  execute(
    dto: IListTasksByContributorRequestDTO
  ): Promise<IPopulatedResponseDTO[]>;
}
