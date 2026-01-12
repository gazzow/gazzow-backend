import type {
  IListTasksByCreatorRequestDTO,
  IPopulatedResponseDTO,
} from "../../../dtos/task.js";

export interface IListTasksByCreatorUseCase {
  execute(dto: IListTasksByCreatorRequestDTO): Promise<IPopulatedResponseDTO[]>;
}
