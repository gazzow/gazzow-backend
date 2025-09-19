import type { IResetPasswordRequestDTO, IResetPasswordResponseDTO } from "../../../../domain/dtos/user.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import type { AuthService } from "../../../../infrastructure/providers/auth-service.js";
import type { HashService } from "../../../../infrastructure/providers/hash-service.js";
import logger from "../../../../utils/logger.js";
import type { IResetPasswordUseCase } from "../../../interfaces/user/auth/reset-password.js";

export class ResetPasswordUseCase implements IResetPasswordUseCase{
  constructor(
    private _hashService: HashService,
    private _authService: AuthService
  ) {}

  async execute(
    data: IResetPasswordRequestDTO
  ): Promise<IResetPasswordResponseDTO> {
    try {
      logger.info(`new password in UC: ${data.password}`)
      const hashedPassword = await this._hashService.hash(data.password);
      logger.info(`hashedPassword in UC: ${hashedPassword} and email: ${data.email}`)

      await this._authService.updatePassword(data.email, hashedPassword);

      return {
        success: true,
        message:ResponseMessages.PasswordUpdatedSuccess,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw error;
    }
  }
}
