import type {
  IAdminListUsersRequestDTO,
  IAdminListUsersResponseDTO,
} from "../../../../domain/dtos/admin/admin.js";
import { UserRole } from "../../../../domain/enums/user-role.js";
import logger from "../../../../utils/logger.js";
import type { IListUsersUseCase } from "../../../interfaces/admin/users-management/list-users.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IUsersMapper } from "../../../mappers/admin/users.js";

export class ListUsersUseCase implements IListUsersUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _usersMapper: IUsersMapper
  ) {}

  execute = async (
    query: IAdminListUsersRequestDTO
  ): Promise<IAdminListUsersResponseDTO> => {
    const { skip = 0, limit = 6 } = query;
    logger.debug(`List user query: ${query}`);
    const usersDoc = await this._userRepository.findAll({
      filter: { role: UserRole.USER },
      skip,
      limit,
    });
    const total = await this._userRepository.count({ role: UserRole.USER });

    // logger.debug(`users list: ${users}`);
    const users = this._usersMapper.toPublicUsersDTO(usersDoc);

    return {
      data: users,
      pagination: {
        limit,
        skip,
        total,
      },
    };
  };
}
