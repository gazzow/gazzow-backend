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
    private _otpStore: IOtpStore,
    private _emailService: IEmailService,
    private _hashService: IHashService,
    private _userRepository: IUserRepository,
    private _otpConfig: IOtpConfig
  ) {}

  // Store user temp info in redis
  async execute(userData: ITempUserData): Promise<void> {
    // Check if the user exist or not
    const existingUser = await this._userRepository.findByEmail(userData.email);

    const hashedPassword = await this._hashService.hash(userData.password);

    const tempUserData = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    };

    // Generate Otp and store hashed otp in redis
    const otp = generateOtp();
     logger.info(`Otp for register: [${otp}]`);
    const hashedOtp = await this._hashService.hash(otp);

    if (existingUser) {
      // User exists - send different email like registration attempt
      await this._emailService.sendAccountExistsNotification(
        userData.email,
        this._otpConfig.emailSubject,
        "An account with this email already exists. If this wasn't you, please ignore this email."
      );
    } else {
      const tempUserKey = `temp:user:${tempUserData.email}`;
      const otpKey = `otp:register:${tempUserData.email}`;

      // Store temp user data and otp on redis
      logger.info(`temp user data before storing redis cache: ${tempUserData}`);
      await Promise.all([
        await this._otpStore.set(
          tempUserKey,
          JSON.stringify(tempUserData),
          this._otpConfig.ttlSeconds
        ),
        await this._otpStore.set(otpKey, hashedOtp, this._otpConfig.ttlSeconds),
      ]);

      // Send OTP via email
      const emailContent = this._otpConfig.emailTemplate(
        otp,
        Math.floor(this._otpConfig.ttlSeconds / 60)
      );

      await this._emailService.sendOtpNotification(
        userData.email,
        this._otpConfig.emailSubject,
        emailContent
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
