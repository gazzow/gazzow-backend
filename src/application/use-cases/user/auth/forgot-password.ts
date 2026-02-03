import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import logger from "../../../../utils/logger.js";
import type { IForgotPasswordUseCase } from "../../../interfaces/usecase/user/auth/forgot-password.js";
import type { IAuthService } from "../../../providers/auth-service.js";
import type { IEmailService } from "../../../providers/email-service.js";
import type { IHashService } from "../../../providers/hash-service.js";
import type { IOtpStore } from "../../../providers/otp-service.js";

export interface IOtpConfig {
  ttlSeconds: number;
  emailSubject: string;
  emailTemplate: (otp: string, expiryMinutes: number) => string;
}

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private _authService: IAuthService,
    private _hashService: IHashService,
    private _emailService: IEmailService,
    private _otpStore: IOtpStore,
    private _otpConfig: IOtpConfig,
  ) {}

  async execute(email: string): Promise<{ otpExpiresAt: number }> {
    // Check if the user exists
    const userDoc = await this._authService.checkUserExists(email);
    if (!userDoc) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const otp = this._authService.generateOtp();
    logger.info(`Otp for forgot password: [${otp}]`);

    // Generate Otp and store hashed otp in redis
    const hashedOtp = await this._hashService.hash(otp);

    const otpKey = `otp:reset:${email}`;
    logger.info(`otpKey in forgot-password: ${otpKey}`);

    await this._otpStore.set(otpKey, hashedOtp, this._otpConfig.ttlSeconds);
    const otpExpiresAt = Date.now() + this._otpConfig.ttlSeconds * 1000;

    // Send OTP via email
    const emailContent = this._otpConfig.emailTemplate(
      otp,
      Math.floor(this._otpConfig.ttlSeconds / 60),
    );

    await this._emailService.sendOtpNotification(
      email,
      this._otpConfig.emailSubject,
      emailContent,
    );

    return { otpExpiresAt };
  }
}
