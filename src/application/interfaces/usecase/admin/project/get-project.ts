import type {
  IAdminGetProjectRequestDTO,
  IAdminGetProjectResponseDTO,
} from "../../../../dtos/admin/project.js";

export interface IAdminGetProjectUseCase {
  execute(
    dto: IAdminGetProjectRequestDTO
  ): Promise<IAdminGetProjectResponseDTO>;
}
