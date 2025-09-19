import type {
  ITempUserData,
  IUserPublic,
  IVerificationResult,
} from "../../../../domain/entities/user.js";
import { UserRole } from "../../../../domain/enums/user-role.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IOtpStore } from "../../../providers/otp-service.js";
import type { IHashService } from "../../../providers/hash-service.js";
import logger from "../../../../utils/logger.js";
import type { IAuthService } from "../../../providers/auth-service.js";
import type { ITokenPayload } from "../../../interfaces/jwt/jwt-payload.js";
import type { IVerifyUserUseCase } from "../../../interfaces/user/auth/verify-user.js";
import { AppError } from "../../../../utils/app-error.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";

export class VerifyUserUseCase implements IVerifyUserUseCase {
  constructor(
    private _otpStore: IOtpStore,
    private _passwordHash: IHashService,
    private _userRepository: IUserRepository,
    private _authService: IAuthService
  ) {}

  async execute(email: string, otp: string): Promise<IVerificationResult> {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      if (!email || !otp) {
        throw new AppError(ResponseMessages.BadRequest, HttpStatusCode.BAD_REQUEST)
      }

      await this._authService.verifyOtp(normalizedEmail, otp, "register");

      // Get and validate temp user data
      const tempUserData = await this.getTempUserData(normalizedEmail);

      // Create user in database with transaction-like behavior
      const createdUser = await this.createUserSafely(tempUserData);
      logger.info(
        `Created user info in verify-otp: ${JSON.stringify(createdUser)}`
      );

      // Generate tokens after successful user creation
      const payload: ITokenPayload = {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      };

      const [accessToken, refreshToken] =
        await this._authService.generateTokens(payload);

      await this.cleanupTempData(normalizedEmail);

      return {
        accessToken,
        refreshToken,
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          status: createdUser.status,
          createdAt: createdUser.createdAt,
        },
        message: "Account created successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  private async verifyOtp(email: string, otp: string): Promise<void> {
    const otpKey = `otp:register:${email}`;

    const storedHashedOtp = await this._otpStore.get(otpKey);
    if (!storedHashedOtp) {
      throw new Error(
        "Verification code has expired. Please request a new one."
      );
    }

    const isValid = await this._passwordHash.compare(otp, storedHashedOtp);
    if (!isValid) {
      throw new Error("Invalid verification code. Please check and try again.");
    }
  } // Update this method re-usable

  private async getTempUserData(email: string): Promise<ITempUserData> {
    const tempKey = `temp:user:${email}`;
    const tempPayload = await this._otpStore.get(tempKey);

    if (!tempPayload) {
      throw new AppError("Registration session has expired. Please start over.");
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
      // Check if user was created
      const existingUser = await this._userRepository.findByEmail(
        tempUserData.email
      );
      if (existingUser) {
        throw new AppError("Account already exists. Please sign in instead.");
      }

      // Create the user
      const user = await this._userRepository.create({
        name: tempUserData.name,
        email: tempUserData.email,
        password: tempUserData.password,
        role: UserRole.USER,
      });

      return user;
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific database errors
        if (
          error.message.includes("duplicate") ||
          error.message.includes("unique")
        ) {
          throw new AppError("Account already exists. Please sign in instead.");
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

      console.log("Cleanup completed for:", email);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`cleanup failed: ${error}`);
        throw new AppError(error.message)
      }
    }
  }
}
