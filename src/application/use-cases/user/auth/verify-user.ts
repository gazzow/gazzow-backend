import type {
  ITempUserData,
  IUserPublic,
  IVerificationResult,
} from "../../../../domain/entities/user.js";
import { UserRole } from "../../../../domain/enums/user-role.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IOtpStore } from "../../../providers/otp-service.js";
import logger from "../../../../utils/logger.js";
import type { IAuthService } from "../../../providers/auth-service.js";
import type { ITokenPayload } from "../../../interfaces/jwt/jwt-payload.js";
import type { IVerifyUserUseCase } from "../../../interfaces/usecase/user/auth/verify-user.js";
import { AppError } from "../../../../utils/app-error.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import type { IUserMapper } from "../../../mappers/user/user.js";

export class VerifyUserUseCase implements IVerifyUserUseCase {
  constructor(
    private _otpStore: IOtpStore,
    private _userRepository: IUserRepository,
    private _authService: IAuthService,
    private _userMapper: IUserMapper
  ) {}

  async execute(email: string, otp: string): Promise<IVerificationResult> {
    const normalizedEmail = email.toLowerCase().trim();
    if (!email || !otp) {
      throw new AppError(
        ResponseMessages.BadRequest,
        HttpStatusCode.BAD_REQUEST
      );
    }
    await this._authService.verifyOtp(normalizedEmail, otp, "register");

    // Get and validate temp user data
    const tempUserData = await this.getTempUserData(normalizedEmail);

    // Create user in database with transaction-like behavior
    const user = await this.createUserSafely(tempUserData);
    logger.info(`Created user info in verify-otp: ${JSON.stringify(user)}`);

    // Generate tokens after successful user creation
    const payload: ITokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] =
      await this._authService.generateTokens(payload);

    await this.cleanupTempData(normalizedEmail);

    return {
      accessToken,
      refreshToken,
      data: user,
    };
  }

  private async getTempUserData(email: string): Promise<ITempUserData> {
    const tempKey = `temp:user:${email}`;
    const tempPayload = await this._otpStore.get(tempKey);

    if (!tempPayload) {
      throw new AppError(
        "Registration session has expired. Please start over."
      );
    }
    logger.info(`Temp payload : ${tempPayload}`);

    try {
      const userData = JSON.parse(tempPayload);
      logger.info(`user data : ${userData}`);

      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        throw new AppError("Invalid registration data");
      }

      return userData;
    } catch (error) {
      logger.error(error);
      throw new Error("Invalid registration data format: ");
    }
  }

  private async createUserSafely(
    tempUserData: ITempUserData
  ): Promise<IUserPublic> {
    try {
      // Create the user
      const userDoc = await this._userRepository.create({
        name: tempUserData.name,
        email: tempUserData.email,
        password: tempUserData.password,
        role: UserRole.USER,
      });

      const user = this._userMapper.toPublicDTO(userDoc);

      return user;
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("E11000") ||
          error.message.includes("duplicate") ||
          error.message.includes("unique")
        ) {
          throw new AppError(
            ResponseMessages.UserAlreadyExists,
            HttpStatusCode.CONFLICT
          );
        }
      }
      throw error;
    }
  }

  private async cleanupTempData(email: string): Promise<void> {
    const otpKey = `otp:register:${email}`;
    const tempKey = `temp:user:${email}`;

    try {
      await Promise.all([
        this._otpStore.delete(otpKey),
        this._otpStore.delete(tempKey),
      ]);

      logger.debug("Cleanup completed for:", email);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`cleanup failed: ${error}`);
        throw new AppError(error.message);
      }
    }
  }
}
