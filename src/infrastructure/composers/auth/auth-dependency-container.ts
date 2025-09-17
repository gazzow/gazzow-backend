import { env } from "../../config/env.js";
import { EmailService } from "../../providers/email-service.js";
import { OtpStore } from "../../providers/otp-service.js";
import { HashService } from "../../providers/hash-service.js";
import { TokenService } from "../../providers/token-service.js";
import { AuthController } from "../../../presentation/controllers/user/auth-controller.js";
import { AuthService } from "../../providers/auth-service.js";
import {
  UserMapper,
  type IUserMapper,
} from "../../../application/mappers/user.js";
import {
  UsersMapper,
  type IUsersMapper,
} from "../../../application/mappers/users.js";
import {
  CheckBlockedUserMiddleware,
  type ICheckBlockedUserMiddleware,
} from "../../../presentation/middleware/user/check-blocked-user.js";
import type { IUserRepository } from "../../../application/interfaces/repository/user-repository.js";
import { UserRepository } from "../../repositories/user-repository.js";
import type { IRegisterUserUseCase } from "../../../application/interfaces/user/auth/register-user.js";
import { RegisterUserUseCase } from "../../../application/use-cases/user/auth/register-user.js";
import type { IVerifyUserUseCase } from "../../../application/interfaces/user/auth/verify-user.js";
import { VerifyUserUseCase } from "../../../application/use-cases/user/auth/verify-user.js";
import type { ILoginUserUseCase } from "../../../application/interfaces/user/auth/login-user.js";
import { LoginUserUseCase } from "../../../application/use-cases/user/auth/login-user.js";
import type { IForgotPasswordUseCase } from "../../../application/interfaces/user/auth/forgot-password.js";
import { ForgotPasswordUseCase } from "../../../application/use-cases/user/auth/forgot-password.js";
import type { IVerifyOtpUseCase } from "../../../application/interfaces/user/auth/verify-otp.js";
import { VerifyOtpUseCase } from "../../../application/use-cases/user/auth/verify-otp.js";
import type { IResetPasswordUseCase } from "../../../application/interfaces/user/auth/reset-password.js";
import { ResetPasswordUseCase } from "../../../application/use-cases/user/auth/reset-password.js";
import { RefreshAccessTokenUseCase } from "../../../application/use-cases/user/auth/refresh-token.js";
import type { IRefreshAccessTokenUseCase } from "../../../application/interfaces/user/auth/refresh-token.js";
import { VerifyToken } from "../../../presentation/middleware/user/verify-token.js";
import { UserModel } from "../../db/models/user-model.js";

export interface IAppConfig {
  otpTtlSeconds: number;
  emailSubject: string;
  saltRounds: number;
}

const getConfig = (): IAppConfig => {
  return {
    otpTtlSeconds: env.otp_ttl_seconds || 300,
    emailSubject: "Your Verification Code",
    saltRounds: env.bcrypt_salt_rounds,
  };
};

export class AuthDependencyContainer {
  private config: IAppConfig;

  constructor() {
    this.config = getConfig();
  }

  createUserRepository(): IUserRepository {
    return new UserRepository(
      UserModel,
      this.createUserMapper(),
      this.createUsersMapper()
    );
  }

  createUserMapper(): IUserMapper {
    return new UserMapper();
  }

  createUsersMapper(): IUsersMapper {
    return new UsersMapper(this.createUserMapper());
  }

  createHashService(): HashService {
    return new HashService(this.config.saltRounds);
  }

  createOtpStore(): OtpStore {
    return new OtpStore();
  }

  createEmailService(): EmailService {
    return new EmailService();
  }

  createTokenService(): TokenService {
    return new TokenService();
  }

  createAuthService(): AuthService {
    return new AuthService(
      this.createUserRepository(),
      this.createTokenService(),
      this.createOtpStore(),
      this.createHashService()
    );
  }

  createStoreTempUC(): IRegisterUserUseCase {
    const otpConfig = {
      ttlSeconds: this.config.otpTtlSeconds,
      emailSubject: this.config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    };

    return new RegisterUserUseCase(
      this.createOtpStore(),
      this.createEmailService(),
      this.createHashService(),
      this.createUserRepository(),
      otpConfig
    );
  }

  createVerifyUserUC(): IVerifyUserUseCase {
    return new VerifyUserUseCase(
      this.createOtpStore(),
      this.createHashService(),
      this.createUserRepository(),
      this.createAuthService()
    );
  }

  createLoginUC(): ILoginUserUseCase {
    return new LoginUserUseCase(
      this.createAuthService(),
      this.createUserMapper()
    );
  }

  createForgotUC(): IForgotPasswordUseCase {
    const otpConfig = {
      ttlSeconds: this.config.otpTtlSeconds,
      emailSubject: this.config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    };

    return new ForgotPasswordUseCase(
      this.createAuthService(),
      this.createHashService(),
      this.createEmailService(),
      this.createOtpStore(),
      otpConfig
    );
  }

  createVerifyUC(): IVerifyOtpUseCase {
    return new VerifyOtpUseCase(this.createAuthService());
  }

  createResetPasswordUC(): IResetPasswordUseCase {
    return new ResetPasswordUseCase(
      this.createHashService(),
      this.createAuthService()
    );
  }

  createRefreshAccessTokenUC = (): IRefreshAccessTokenUseCase => {
    return new RefreshAccessTokenUseCase(this.createTokenService());
  };

  // auth controller
  createAuthController(): AuthController {
    return new AuthController(
      this.createStoreTempUC(),
      this.createVerifyUserUC(),
      this.createLoginUC(),
      this.createForgotUC(),
      this.createVerifyUC(),
      this.createResetPasswordUC(),
      this.createRefreshAccessTokenUC()
    );
  }

  // token middleware
  createTokenMiddleware(): VerifyToken {
    return new VerifyToken(this.createTokenService());
  }

  // Check blocked user middleware
  createBlockedUserMiddleware(): ICheckBlockedUserMiddleware {
    return new CheckBlockedUserMiddleware(this.createUserRepository());
  }
}
