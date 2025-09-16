import type { IAdminListUsersResponseDTO } from "../../../../domain/dtos/admin/admin.js";
import logger from "../../../../utils/logger.js";
import type { IListUsersUseCase } from "../../../interfaces/admin/users-management/list-users.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";



export class ListUsersUC implements IListUsersUseCase{
    constructor(
        private userRepository: IUserRepository,
    ){}

    execute = async (): Promise<IAdminListUsersResponseDTO> => {
        
        const users = await this.userRepository.findAll();
        logger.debug(`users list: ${users}`);
        return {
            success: true,
            users,
        }
    }
}