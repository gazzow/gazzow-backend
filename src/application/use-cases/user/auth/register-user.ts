import type { IEmailService } from "../../../providers/email-service.js";
import type { IOtpStore } from "../../../providers/otp-service.js";
import type { IHashService } from "../../../providers/hash-service.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import logger from "../../../../utils/logger.js";
import type { IRegisterUserUseCase } from "../../../interfaces/usecase/user/auth/register-user.js";
import { AppError } from "../../../../utils/app-error.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import type { IAuthService } from "../../../providers/auth-service.js";
import type {
  IRegisterUserRequestDTO,
  IRegisterUserResponseDTO,
} from "../../../dtos/user/user.js";

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

  async execute(
    dto: IRegisterUserRequestDTO,
  ): Promise<IRegisterUserResponseDTO> {
    // Check if the user exist or not
    const existingUser = await this._userRepository.findByEmail(dto.email);

    const hashedPassword = await this._hashService.hash(dto.password);

    const tempUserData = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    // Generate Otp and store hashed otp in redis
    const otp = this._authService.generateOtp();
    logger.debug(`Otp for register: [${otp}]`);
    const hashedOtp = await this._hashService.hash(otp);

    if (existingUser) {
      // User exists - send different email like registration attempt
      await this._emailService.sendAccountExistsNotification(
        dto.email,
        this._otpConfig.emailSubject,
        "An account with this email already exists. If this wasn't you, please ignore this email.",
      );

      throw new AppError(
        ResponseMessages.UserAlreadyExists,
        HttpStatusCode.BAD_REQUEST,
      );
    } else {
      const tempUserKey = `temp:user:${tempUserData.email}`;
      const otpKey = `otp:register:${tempUserData.email}`;

      // Store temp user data and otp on redis
      await Promise.all([
        this._otpStore.set(
          tempUserKey,
          JSON.stringify(tempUserData),
          this._otpConfig.ttlSeconds,
        ),
        this._otpStore.set(otpKey, hashedOtp, this._otpConfig.ttlSeconds),
      ]);
      const otpExpiresAt = Date.now() + this._otpConfig.ttlSeconds * 1000;

      // Send OTP via email
      const emailContent = this._otpConfig.emailTemplate(
        otp,
        Math.floor(this._otpConfig.ttlSeconds / 60),
      );

      await this._emailService.sendOtpNotification(
        dto.email,
        this._otpConfig.emailSubject,
        emailContent,
      );
      return { otpExpiresAt };
    }
  }
}
