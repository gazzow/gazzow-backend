import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import logger from "../../../../utils/logger.js";
import type { IChangePasswordRequestDTO } from "../../../dtos/user/user.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IChangePasswordUseCase } from "../../../interfaces/usecase/user/profile/change-password.js";
import type { IHashService } from "../../../providers/hash-service.js";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _hashService: IHashService,
  ) {}

  async execute(dto: IChangePasswordRequestDTO): Promise<void> {
    const user = await this._userRepository.findById(dto.userId);

    if (!user) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }
    
    const isMatch = await this._hashService.compare(
      dto.newPassword,
      user.password,
    );

    if (isMatch) {
      logger.warn("Password mismatch attempt", { userId: dto.userId });

      throw new AppError(
        ResponseMessages.InvalidCredentials,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new AppError(
        ResponseMessages.PasswordMustBeDifferent,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const hashedPassword = await this._hashService.hash(dto.newPassword);

    await this._userRepository.update(dto.userId, {
      password: hashedPassword,
    });

  }
}
