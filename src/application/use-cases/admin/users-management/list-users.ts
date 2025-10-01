import type {
  IAdminListUsersRequestDTO,
  IAdminListUsersResponseDTO,
} from "../../../dtos/admin/admin.js";
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
    logger.debug(`List user query: ${JSON.stringify(query)}`);
    const {
      skip = 0,
      limit = 6,
      search,
      status,
      role,
      sortField,
      sortOrder,
    } = query;

    const dbFilter: any = { role: UserRole.USER };

    if(search){
      dbFilter.$or = [
        {name: {$regex: search, $options: "i"}},
        {email: {$regex: search, $options: "i"}}
      ]
    }

    if (status) dbFilter.status = status;
    if (role) dbFilter.role = role;

    const sortQuery: any = {};
    if (sortField) {
      sortQuery[sortField] = sortOrder === "asc" ? 1 : -1;
    } else {
      sortQuery.createdAt = -1;
    }

    logger.debug(`filter query: ${JSON.stringify(dbFilter)}`);
    logger.debug(`sort query: ${JSON.stringify(sortQuery)}`);

    // Fetch users
    const usersDoc = await this._userRepository.findAll({
      filter: dbFilter,
      skip,
      limit,
      sort: sortQuery,
    });

    // Use SAME filter for count
    const total = await this._userRepository.count(dbFilter);

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
