import type { IGetUserProfileResponseDTO } from "../../../../domain/dtos/user.js";
import { AppError } from "../../../../utils/app-error.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IGetUserProfileUseCase } from "../../../interfaces/user/profile/get-user-profile.js";

export class GetUserProfileUC implements IGetUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  execute = async (id: string): Promise<IGetUserProfileResponseDTO> => {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    return {
      success: true,
      user,
    };
  };
}
