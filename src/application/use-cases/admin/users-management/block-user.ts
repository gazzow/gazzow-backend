import type { IUserBlockResponseDTO } from "../../../dtos/admin/admin.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import type { UserStatus } from "../../../../domain/enums/user-role.js";
import { AppError } from "../../../../utils/app-error.js";
import logger from "../../../../utils/logger.js";
import type { IBlockUserUseCase } from "../../../interfaces/admin/users-management/block-user.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IUserMapper } from "../../../mappers/user/user.js";

export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper
  ) {}

  async execute(
    userId: string,
    status: UserStatus
  ): Promise<IUserBlockResponseDTO> {
    logger.debug("blocker user uc start process request");

    const updatedUserDoc = await this._userRepository.updateStatus(userId, status);
    if (!updatedUserDoc) {
      logger.debug('User not found on block user uc')
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const updatedUser = this._userMapper.toPublicDTO(updatedUserDoc);

    return {
      data: updatedUser,
    };
  }
}
