import type { IForgotPasswordResponseDTO } from "../../../../domain/dtos/user.js";
import { generateOtp } from "../../../../infrastructure/utils/generate-otp.js";
import logger from "../../../../utils/logger.js";
import type { IForgotPasswordUseCase } from "../../../interfaces/user/auth/forgot-password.js";
import type { IAuthService } from "../../../providers/auth-service.js";
import type { IEmailService } from "../../../providers/email-service.js";
import type { IHashService } from "../../../providers/hash-service.js";
import type { IOtpStore } from "../../../providers/otp-service.js";

export interface IOtpConfig {
  ttlSeconds: number;
  emailSubject: string;
  emailTemplate: (otp: string, expiryMinutes: number) => string;
}

export class ForgotPasswordUseCase implements IForgotPasswordUseCase{
  constructor(
    private authService: IAuthService,
    private hashService: IHashService,
    private emailService: IEmailService,
    private otpStore: IOtpStore,
    private otpConfig: IOtpConfig
  ) {}

  async execute(email: string): Promise<IForgotPasswordResponseDTO> {
    try {
      // Check if the user exists
      const user = await this.authService.checkUserExists(email);
      const otp = generateOtp();

      if (user) {
        // Generate Otp and store hashed otp in redis
        const hashedOtp = await this.hashService.hash(otp);

        logger.info(`Otp for forgot password: [${otp}]`);

        const otpKey = `otp:reset:${email}`;
        logger.info(`otpKey in forgot-password: ${otpKey}`);
        await this.otpStore.set(otpKey, hashedOtp, this.otpConfig.ttlSeconds);

        // Send OTP via email
        const emailContent = this.otpConfig.emailTemplate(
          otp,
          Math.floor(this.otpConfig.ttlSeconds / 60)
        );

        await this.emailService.sendOtpNotification(
          email,
          this.otpConfig.emailSubject,
          emailContent
        );
      }

      return {
        success: true,
        message: `You will receive a verification code shortly. Please check your email.${otp}`,
      };
    } catch (error) {
      console.log(error);
      throw new Error(
        "Unable to process password reset request. Please try again."
      );
    }
  }
}
