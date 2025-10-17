import type { IGetUserProfileResponseDTO } from "../../../dtos/user/user.js";
import { AppError } from "../../../../utils/app-error.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IGetUserProfileUseCase } from "../../../interfaces/usecase/user/profile/get-profile.js";
import type { IUserMapper } from "../../../mappers/user/user.js";

export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper
  ) {}

  execute = async (id: string): Promise<IGetUserProfileResponseDTO> => {
    const userDoc = await this._userRepository.findById(id);
    if (!userDoc) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const data = this._userMapper.toPublicDTO(userDoc);

    return {
      data,
    };
  };
}
