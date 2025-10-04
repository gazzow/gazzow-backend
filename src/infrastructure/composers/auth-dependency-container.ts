import { env } from "process";

import { UserModel } from "../db/models/user-model.js";

import {
  UserMapper,
  type IUserMapper,
} from "../../application/mappers/user/user.js";

import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

import type { ITokenService } from "../../application/providers/token-service.js";
import { TokenService } from "../providers/token-service.js";

import type { IHashService } from "../../application/providers/hash-service.js";
import { HashService } from "../providers/hash-service.js";

import type { IAuthService } from "../../application/providers/auth-service.js";
import { AuthService } from "../providers/auth-service.js";

import type { IOtpStore } from "../../application/providers/otp-service.js";
import { OtpStore } from "../providers/otp-service.js";

import type { IRegisterUserUseCase } from "../../application/interfaces/usecase/user/auth/register-user.js";
import { RegisterUserUseCase } from "../../application/use-cases/user/auth/register-user.js";

import type { IEmailService } from "../../application/providers/email-service.js";
import { EmailService } from "../providers/email-service.js";

import type { IVerifyUserUseCase } from "../../application/interfaces/usecase/user/auth/verify-user.js";
import { VerifyUserUseCase } from "../../application/use-cases/user/auth/verify-user.js";

import type { ILoginUserUseCase } from "../../application/interfaces/usecase/user/auth/login-user.js";
import { LoginUserUseCase } from "../../application/use-cases/user/auth/login-user.js";

import type { IForgotPasswordUseCase } from "../../application/interfaces/usecase/user/auth/forgot-password.js";
import { ForgotPasswordUseCase } from "../../application/use-cases/user/auth/forgot-password.js";

import type { IVerifyOtpUseCase } from "../../application/interfaces/usecase/user/auth/verify-otp.js";
import { VerifyOtpUseCase } from "../../application/use-cases/user/auth/verify-otp.js";

import type { IResetPasswordUseCase } from "../../application/interfaces/usecase/user/auth/reset-password.js";
import { ResetPasswordUseCase } from "../../application/use-cases/user/auth/reset-password.js";

import type { IResendOtpUseCase } from "../../application/interfaces/usecase/user/auth/resend-otp.js";
import { ResendOtpUseCase } from "../../application/use-cases/user/auth/resend-otp.js";

import type { IRefreshAccessTokenUseCase } from "../../application/interfaces/usecase/user/auth/refresh-token.js";
import { RefreshAccessTokenUseCase } from "../../application/use-cases/user/auth/refresh-token.js";

import type { IGoogleCallbackUseCase } from "../../application/interfaces/usecase/user/auth/google-callback.js";
import { GoogleCallBackUseCase } from "../../application/use-cases/user/auth/google-callback.js";

import { AuthController } from "../../presentation/controllers/user/auth-controller.js";

import { VerifyToken } from "../../presentation/middleware/user/verify-token.js";

import {
  CheckBlockedUserMiddleware,
  type ICheckBlockedUserMiddleware,
} from "../../presentation/middleware/user/check-blocked-user.js";

export interface IAppConfig {
  otpTtlSeconds: number;
  emailSubject: string;
  saltRounds: number;
}

const getConfig = (): IAppConfig => {
  return {
    otpTtlSeconds: Number(env.otp_ttl_seconds) || 300,
    emailSubject: "Your Verification Code",
    saltRounds: Number(env.bcrypt_salt_rounds) || 6,
  };
};

export class AuthDependencyContainer {
  private config: IAppConfig;
  private readonly _userRepository: IUserRepository;
  private readonly _userMapper: IUserMapper;
  private readonly _emailService: IEmailService;
  private readonly _tokenService: ITokenService;
  private readonly _otpStore: IOtpStore;
  private readonly _authService: IAuthService;
  private readonly _hashService: IHashService;

  constructor() {
    this.config = getConfig();
    this._userRepository = new UserRepository(UserModel);
    this._userMapper = new UserMapper();
    this._emailService = new EmailService();
    this._tokenService = new TokenService();
    this._hashService = new HashService();
    this._otpStore = new OtpStore();
    this._authService = new AuthService(
      this._userRepository,
      this._tokenService,
      this._otpStore,
      this._hashService
    );
  }

  createStoreTempUseCase(): IRegisterUserUseCase {
    const otpConfig = {
      ttlSeconds: this.config.otpTtlSeconds,
      emailSubject: this.config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    };

    return new RegisterUserUseCase(
      this._otpStore,
      this._emailService,
      this._hashService,
      this._userRepository,
      this._authService,
      otpConfig
    );
  }

  createVerifyUserUseCase(): IVerifyUserUseCase {
    return new VerifyUserUseCase(
      this._otpStore,
      this._userRepository,
      this._authService,
      this._userMapper
    );
  }

  createLoginUseCase(): ILoginUserUseCase {
    return new LoginUserUseCase(this._authService, this._userMapper);
  }

  createForgotUseCase(): IForgotPasswordUseCase {
    const otpConfig = {
      ttlSeconds: this.config.otpTtlSeconds,
      emailSubject: this.config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    };

    return new ForgotPasswordUseCase(
      this._authService,
      this._hashService,
      this._emailService,
      this._otpStore,
      otpConfig
    );
  }

  createVerifyOtpUseCase(): IVerifyOtpUseCase {
    return new VerifyOtpUseCase(this._authService);
  }

  createResetPasswordUseCase(): IResetPasswordUseCase {
    return new ResetPasswordUseCase(this._hashService, this._authService);
  }

  createResendOtpUseCase(): IResendOtpUseCase {
    const otpConfig = {
      ttlSeconds: this.config.otpTtlSeconds,
      emailSubject: this.config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    };

    return new ResendOtpUseCase(
      this._userRepository,
      this._authService,
      this._hashService,
      this._emailService,
      this._otpStore,
      otpConfig
    );
  }

  createRefreshAccessTokenUseCase = (): IRefreshAccessTokenUseCase => {
    return new RefreshAccessTokenUseCase(this._tokenService);
  };

  createGoogleCallbackUseCase = (): IGoogleCallbackUseCase => {
    return new GoogleCallBackUseCase(this._authService);
  };

  // Auth controller
  createAuthController(): AuthController {
    return new AuthController(
      this.createStoreTempUseCase(),
      this.createVerifyUserUseCase(),
      this.createLoginUseCase(),
      this.createForgotUseCase(),
      this.createVerifyOtpUseCase(),
      this.createResetPasswordUseCase(),
      this.createResendOtpUseCase(),
      this.createRefreshAccessTokenUseCase(),
      this.createGoogleCallbackUseCase()
    );
  }

  // Token middleware
  createTokenMiddleware(): VerifyToken {
    return new VerifyToken(this._tokenService);
  }

  // Check blocked user middleware
  createBlockedUserMiddleware(): ICheckBlockedUserMiddleware {
    return new CheckBlockedUserMiddleware(this._userRepository);
  }
}
