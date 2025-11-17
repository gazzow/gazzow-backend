import type { IAdminListProjectsResponseDTO } from "../../../../dtos/admin/project.js";

export interface IAdminListProjectsUseCase{
    execute(): Promise<IAdminListProjectsResponseDTO>
}