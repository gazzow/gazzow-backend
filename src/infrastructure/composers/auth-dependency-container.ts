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
  private readonly userRepository: IUserRepository;
  private readonly userMapper: IUserMapper;
  private readonly emailService: IEmailService;
  private readonly tokenService: ITokenService;
  private readonly otpStore: IOtpStore;
  private readonly authService: IAuthService;
  private readonly hashService: IHashService;

  constructor() {
    this.config = getConfig();
    this.userRepository = new UserRepository(UserModel);
    this.userMapper = new UserMapper();
    this.emailService = new EmailService();
    this.tokenService = new TokenService();
    this.hashService = new HashService();
    this.otpStore = new OtpStore();
    this.authService = new AuthService(
      this.userRepository,
      this.tokenService,
      this.otpStore,
      this.hashService
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
      this.otpStore,
      this.emailService,
      this.hashService,
      this.userRepository,
      this.authService,
      otpConfig
    );
  }

  createVerifyUserUseCase(): IVerifyUserUseCase {
    return new VerifyUserUseCase(
      this.otpStore,
      this.userRepository,
      this.authService,
      this.userMapper
    );
  }

  createLoginUseCase(): ILoginUserUseCase {
    return new LoginUserUseCase(this.authService, this.userMapper);
  }

  createForgotUseCase(): IForgotPasswordUseCase {
    const otpConfig = {
      ttlSeconds: this.config.otpTtlSeconds,
      emailSubject: this.config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    };

    return new ForgotPasswordUseCase(
      this.authService,
      this.hashService,
      this.emailService,
      this.otpStore,
      otpConfig
    );
  }

  createVerifyOtpUseCase(): IVerifyOtpUseCase {
    return new VerifyOtpUseCase(this.authService);
  }

  createResetPasswordUseCase(): IResetPasswordUseCase {
    return new ResetPasswordUseCase(this.hashService, this.authService);
  }

  createResendOtpUseCase(): IResendOtpUseCase {
    const otpConfig = {
      ttlSeconds: this.config.otpTtlSeconds,
      emailSubject: this.config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    };

    return new ResendOtpUseCase(
      this.userRepository,
      this.authService,
      this.hashService,
      this.emailService,
      this.otpStore,
      otpConfig
    );
  }

  createRefreshAccessTokenUseCase = (): IRefreshAccessTokenUseCase => {
    return new RefreshAccessTokenUseCase(this.tokenService);
  };

  createGoogleCallbackUseCase = (): IGoogleCallbackUseCase => {
    return new GoogleCallBackUseCase(this.authService);
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
    return new VerifyToken(this.tokenService);
  }

  // Check blocked user middleware
  createBlockedUserMiddleware(): ICheckBlockedUserMiddleware {
    return new CheckBlockedUserMiddleware(this.userRepository);
  }
}
