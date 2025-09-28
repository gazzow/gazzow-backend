import type { ITokenPayload } from "../../application/interfaces/jwt/jwt-payload.js";
import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { IAuthService } from "../../application/providers/auth-service.js";
import type { IHashService } from "../../application/providers/hash-service.js";
import type { IOtpStore } from "../../application/providers/otp-service.js";
import type { ITokenService } from "../../application/providers/token-service.js";
import type { IUserDocument } from "../db/models/user-model.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { AppError } from "../../utils/app-error.js";
import logger from "../../utils/logger.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _tokenService: ITokenService,
    private _otpStore: IOtpStore,
    private _hashService: IHashService
  ) {}

  async checkUserExists(email: string): Promise<IUserDocument | null> {
    return this._userRepository.findByEmail(email);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await this._hashService.compare(password, hash);
  }

  async verifyOtp(email: string, otp: string, purpose: string): Promise<void> {
    const otpKey = `otp:${purpose}:${email}`;
    logger.info(`verify otpKey in service: ${otpKey}`);

    const storedHashedOtp = await this._otpStore.get(otpKey);
    logger.info(`hashedOtp in service: ${storedHashedOtp}`);

    if (!storedHashedOtp) {
      throw new AppError(
        ResponseMessages.VerificationCodeExpired,
        HttpStatusCode.GONE
      );
    }

    const isValid = await this._hashService.compare(otp, storedHashedOtp);
    if (!isValid) {
      throw new AppError(
        ResponseMessages.InvalidVerificationCode,
        HttpStatusCode.BAD_REQUEST
      );
    }
  }

  async generateTokens(payload: ITokenPayload): Promise<[string, string]> {
    return Promise.all([
      this._tokenService.createAccessToken(payload),
      this._tokenService.createRefreshToken(payload),
    ]);
  }

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<void | null> {
    return this._userRepository.updatePassword(email, hashedPassword);
  }
}
