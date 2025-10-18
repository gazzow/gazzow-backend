import type {
  IListMyProjectRequestDTO,
  IListMyProjectsResponseDTO,
} from "../../../dtos/project.js";

export interface IListMyProjectsUsecase {
  execute(dto: IListMyProjectRequestDTO): Promise<IListMyProjectsResponseDTO>;
}
