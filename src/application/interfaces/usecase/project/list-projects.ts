import type { IListProjectRequestDTO, IListProjectResponseDTO } from "../../../dtos/project.js";

export interface IListProjectUseCase {
  execute(dto: IListProjectRequestDTO): Promise<IListProjectResponseDTO>;
}
