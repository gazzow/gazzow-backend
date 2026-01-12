import type { IAdminListProjectsRequestDTO, IAdminListProjectsResponseDTO } from "../../../../dtos/admin/project.js";

export interface IAdminListProjectsUseCase{
    execute(query: IAdminListProjectsRequestDTO): Promise<IAdminListProjectsResponseDTO>
}