import type { IUserBlockResponseDTO } from "../../../../domain/dtos/admin/admin.js";
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
    id: string,
    status: UserStatus
  ): Promise<IUserBlockResponseDTO> {
    logger.debug("blocker user uc start process request");
    const user = await this._userRepository.findById(id);
    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    const updatedUserDoc = await this._userRepository.updateStatus(id, status);
    if (!updatedUserDoc) {
      throw new Error("User not found");
    }

    const updatedUser = this._userMapper.toPublicDTO(updatedUserDoc);

    return {
      success: true,
      message: `User status updated to ${status}`,
      user: updatedUser,
    };
  }
}
