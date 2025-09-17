import type { IAdminListUsersResponseDTO } from "../../../../domain/dtos/admin/admin.js";

export interface IListUsersUseCase{
    execute(): Promise<IAdminListUsersResponseDTO>
}