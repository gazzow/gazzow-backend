import type { IAdminDeleteProjectRequestDTO } from "../../../../dtos/admin/project.js";

export interface IAdminDeleteProjectUseCase {
  execute(dto: IAdminDeleteProjectRequestDTO): Promise<void>;
}
