import logger from "../../../../utils/logger.js";
import type { IResendOtpRequestDTO } from "../../../dtos/user/user.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type {
  IResendOtpUseCase,
} from "../../../interfaces/user/auth/resend-otp.js";

import type { IAuthService } from "../../../providers/auth-service.js";
import type { IEmailService } from "../../../providers/email-service.js";
import type { IHashService } from "../../../providers/hash-service.js";
import type { IOtpStore } from "../../../providers/otp-service.js";

export interface IOtpConfig {
  ttlSeconds: number;
  emailSubject: string;
  emailTemplate: (otp: string, expiryMinutes: number) => string;
}

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _authService: IAuthService,
    private _hashService: IHashService,
    private _emailService: IEmailService,
    private _otpStore: IOtpStore,
    private _otpConfig: IOtpConfig
  ) {}

  async execute(data: IResendOtpRequestDTO): Promise<void> {
    const otp = this._authService.generateOtp();
    logger.info(`Re-send otp: [ ${otp} ]`);

    const hashedOtp = await this._hashService.hash(otp);

    const otpKey = `otp:${data.purpose}:${data.email}`;
    logger.info(`resend otp key: ${otpKey}`);

    await this._otpStore.delete(otpKey);
    await this._otpStore.set(otpKey, hashedOtp, this._otpConfig.ttlSeconds);

    const emailContent = this._otpConfig.emailTemplate(
      otp,
      Math.floor(this._otpConfig.ttlSeconds / 60)
    );

    await this._emailService.sendOtpNotification(
      data.email,
      this._otpConfig.emailSubject,
      emailContent
    );
  }
}
