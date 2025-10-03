import type {
  IResetPasswordRequestDTO,
} from "../../../dtos/user/user.js";
import logger from "../../../../utils/logger.js";
import type { IResetPasswordUseCase } from "../../../interfaces/usecase/user/auth/reset-password.js";
import type { IHashService } from "../../../providers/hash-service.js";
import type { IAuthService } from "../../../providers/auth-service.js";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private _hashService: IHashService,
    private _authService: IAuthService,
  ) {}

  async execute(
    data: IResetPasswordRequestDTO
  ): Promise<void> {
    logger.info(`new password in UC: ${data.password}`);
    const hashedPassword = await this._hashService.hash(data.password);
    logger.info(
      `hashedPassword in UC: ${hashedPassword} and email: ${data.email}`
    );

    await this._authService.updatePassword(data.email, hashedPassword);
  }
}
