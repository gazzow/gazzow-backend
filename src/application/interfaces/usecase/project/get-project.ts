import type {
  IGetProjectRequestDTO,
  IGetProjectResponseDTO,
} from "../../../dtos/project.js";

export interface IGetProjectUseCase {
  execute(dto: IGetProjectRequestDTO): Promise<IGetProjectResponseDTO>;
}
