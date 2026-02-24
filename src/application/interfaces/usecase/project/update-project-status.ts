import type {
  IUpdateProjectResponseDTO,
  IUpdateProjectStatusRequestDTO,
} from "../../../dtos/project.js";

export interface IUpdateProjectStatusUseCase {
  execute(
    dto: IUpdateProjectStatusRequestDTO,
  ): Promise<IUpdateProjectResponseDTO>;
}
