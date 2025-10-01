import type {
  IResetPasswordRequestDTO,
} from "../../../dtos/user/user.js";
import type { AuthService } from "../../../../infrastructure/providers/auth-service.js";
import type { HashService } from "../../../../infrastructure/providers/hash-service.js";
import logger from "../../../../utils/logger.js";
import type { IResetPasswordUseCase } from "../../../interfaces/user/auth/reset-password.js";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private _hashService: HashService,
    private _authService: AuthService
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
