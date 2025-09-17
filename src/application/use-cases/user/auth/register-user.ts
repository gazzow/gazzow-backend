import type { IEmailService } from "../../../providers/email-service.js";
import type { IOtpStore } from "../../../providers/otp-service.js";
import type { IHashService } from "../../../providers/hash-service.js";
import type { ITempUserData } from "../../../../domain/entities/user.js";
import { generateOtp } from "../../../../infrastructure/utils/generate-otp.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import logger from "../../../../utils/logger.js";
import type { IRegisterUserUseCase } from "../../../interfaces/user/auth/register-user.js";

export interface IOtpConfig {
  ttlSeconds: number;
  emailSubject: string;
  emailTemplate: (otp: string, expiryMinutes: number) => string;
}



export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private otpStore: IOtpStore,
    private emailService: IEmailService,
    private hashService: IHashService,
    private userRepository: IUserRepository,
    private otpConfig: IOtpConfig
  ) {}

  // Store user temp info in redis
  async execute(
    userData: ITempUserData
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if the user exist or not
      const existingUser = await this.userRepository.findByEmail(
        userData.email
      );

      const hashedPassword = await this.hashService.hash(userData.password);

      const tempUserData = {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      };

      // Generate Otp and store hashed otp in redis
      const otp = generateOtp();
      const hashedOtp = await this.hashService.hash(otp);

      if (existingUser) {
        // User exists - send different email like registration attempt
        await this.emailService.sendAccountExistsNotification(
          userData.email,
          this.otpConfig.emailSubject,
          "An account with this email already exists. If this wasn't you, please ignore this email."
        );
      } else {
        const tempUserKey = `temp:user:${tempUserData.email}`;
        const otpKey = `otp:register:${tempUserData.email}`;

        // Store temp user data and otp on redis
        logger.info(
          `temp user data before storing redis cache: ${tempUserData}`
        );
        await Promise.all([
          await this.otpStore.set(
            tempUserKey,
            JSON.stringify(tempUserData),
            this.otpConfig.ttlSeconds
          ),
          await this.otpStore.set(otpKey, hashedOtp, this.otpConfig.ttlSeconds),
        ]);

        // Send OTP via email
        const emailContent = this.otpConfig.emailTemplate(
          otp,
          Math.floor(this.otpConfig.ttlSeconds / 60)
        );

        await this.emailService.sendOtpNotification(
          userData.email,
          this.otpConfig.emailSubject,
          emailContent
        );
      }

      return {
        success: true,
        message: `You will receive a verification code shortly. Please check your email.[${otp}]`,
      };
    } catch (error) {
      console.error("Error in StoreTempUserAndSentOtpUC:", error);
      throw new Error(
        "Unable to process registration request. Please try again."
      );
    }
  }
}

// dependency injection with factory function
export class StoreTempUserAndSentOtpUCFactory {
  static create(
    otpStore: IOtpStore,
    emailService: IEmailService,
    hashService: IHashService,
    userRepository: IUserRepository,
    config: {
      otpTtlSeconds: number;
      emailSubject: string;
    }
  ): IRegisterUserUseCase {
    const otpConfig: IOtpConfig = {
      ttlSeconds: config.otpTtlSeconds,
      emailSubject: config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your Gazzow verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.\n\nIf you didn't request this, please ignore this email.`,
    };

    return new RegisterUserUseCase(
      otpStore,
      emailService,
      hashService,
      userRepository,
      otpConfig
    );
  }
}
