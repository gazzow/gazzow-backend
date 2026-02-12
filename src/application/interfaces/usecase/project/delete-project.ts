import type {
  IDeleteProjectRequestDTO,
  IDeleteProjectResponseDTO,
} from "../../../dtos/project.js";

export interface IDeleteProjectUseCase {
  execute(dto: IDeleteProjectRequestDTO): Promise<IDeleteProjectResponseDTO>;
}
