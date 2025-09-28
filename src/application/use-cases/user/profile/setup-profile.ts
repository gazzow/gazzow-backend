import type {
  IUpdateProfileRequestDTO,
  IUpdateProfileResponseDTO,
} from "../../../../domain/dtos/user.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IUpdateUserProfileUseCase } from "../../../interfaces/user/profile/setup-profile.js";
import type { IUserMapper } from "../../../mappers/user/user.js";

export class SetupUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper
  ) {}

  execute = async (
    userId: string,
    profileData: IUpdateProfileRequestDTO
  ): Promise<IUpdateProfileResponseDTO> => {
    const updatedUserDoc = await this._userRepository.updateProfile(
      userId,
      profileData
    );

    if (!updatedUserDoc) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const data = this._userMapper.toPublicDTO(updatedUserDoc);
    return {
      data
    };
  };
}
