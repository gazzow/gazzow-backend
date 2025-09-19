import type { IAdminListUsersRequestDTO, IAdminListUsersResponseDTO } from "../../../../domain/dtos/admin/admin.js";

export interface IListUsersUseCase{
    execute(query: IAdminListUsersRequestDTO): Promise<IAdminListUsersResponseDTO>
}