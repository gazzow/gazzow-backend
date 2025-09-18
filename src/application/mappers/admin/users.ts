import type { IUserPublicDTO } from "../../../domain/dtos/user.js";
import type { IUserDocument } from "../../../infrastructure/db/models/user-model.js";
import type { IUserMapper } from "../user/user.js";

export interface IUsersMapper{
    toPublicUsersDTO(users: IUserDocument[]): IUserPublicDTO[];
}

export class UsersMapper implements IUsersMapper {
  constructor(private userMapper: IUserMapper) {}

   toPublicUsersDTO(users: IUserDocument[]): IUserPublicDTO[] {
   const result = users.map((user) => {
    return this.userMapper.toPublicDTO(user)
   });

   return result;
  } 
}
