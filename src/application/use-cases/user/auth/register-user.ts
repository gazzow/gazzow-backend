import type { IEmailService } from "../../../providers/email-service.js";
import type { IOtpStore } from "../../../providers/otp-service.js";
import type { IHashService } from "../../../providers/hash-service.js";
import type { ITempUserData } from "../../../../domain/entities/user.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import logger from "../../../../utils/logger.js";
import type { IRegisterUserUseCase } from "../../../interfaces/user/auth/register-user.js";
import { AppError } from "../../../../utils/app-error.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import type { IAuthService } from "../../../providers/auth-service.js";

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
    private _authService: IAuthService,
    private _otpConfig: IOtpConfig,
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
    const otp = this._authService.generateOtp();
     logger.info(`Otp for register: [${otp}]`);
    const hashedOtp = await this._hashService.hash(otp);

    if (existingUser) {
      // User exists - send different email like registration attempt
      await this._emailService.sendAccountExistsNotification(
        userData.email,
        this._otpConfig.emailSubject,
        "An account with this email already exists. If this wasn't you, please ignore this email."
      );

      throw new AppError(ResponseMessages.UserAlreadyExists, HttpStatusCode.BAD_REQUEST)
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

