import type { IAdminListUsersRequestDTO, IAdminListUsersResponseDTO } from "../../../dtos/admin/admin.js";

export interface IListUsersUseCase{
    execute(query: IAdminListUsersRequestDTO): Promise<IAdminListUsersResponseDTO>
}