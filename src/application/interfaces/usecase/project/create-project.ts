import type { ICreateProjectRequestDTO, ICreateProjectResponseDTO } from "../../../dtos/project.js";

export interface ICreateProjectUseCase {
  execute(data: ICreateProjectRequestDTO): Promise<ICreateProjectResponseDTO>;
}
