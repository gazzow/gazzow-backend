import type {
  IListApplicationRequestDTO,
  IListApplicationResponseDTO,
} from "../../../dtos/application.js";

export interface IListApplicationsUseCase {
  execute(
    dto: IListApplicationRequestDTO
  ): Promise<IListApplicationResponseDTO>;
}
