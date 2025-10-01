import type { IGetUserResponseDTO } from "../../../dtos/admin/admin.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import type { IGetUserUseCase } from "../../../interfaces/admin/users-management/get-user.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IUserMapper } from "../../../mappers/user/user.js";

export class GetUserUseCase implements IGetUserUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper
  ) {}

  async execute(id: string): Promise<IGetUserResponseDTO> {
    const userDoc = await this._userRepository.findById(id);
    if (!userDoc) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const user = this._userMapper.toPublicDTO(userDoc);

    return {
      data: user,
    };
  }
}
