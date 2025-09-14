import { env } from "../../infrastructure/config/env.js";
import { StoreTempUserAndSentOtpUC } from "../../application/use-cases/user/auth/store-temp-user-and-send-otp.js";
import { VerifyOtpAndCreateUserUC } from "../../application/use-cases/user/auth/verify-otp-and-create-user.js";
import { EmailService } from "../../infrastructure/providers/email-service.js";
import { OtpStore } from "../../infrastructure/providers/otp-service.js";
import { HashService } from "../../infrastructure/providers/hash-service.js";
import { TokenService } from "../../infrastructure/providers/token-service.js";
import { UserRepository } from "../../infrastructure/repositories/user-repository.js";
import { AuthController } from "../../presentation/controllers/user/auth-controller.js";
import { LoginUserUC } from "../../application/use-cases/user/auth/login-user.js";
import { AuthService } from "../../infrastructure/providers/auth-service.js";
import { ForgotPasswordUC } from "../../application/use-cases/user/auth/forgot-password.js";
import { VerifyOtpUC } from "../../application/use-cases/user/auth/verify-otp.js";
import { ResetPasswordUC } from "../../application/use-cases/user/auth/reset-password.js";
import { VerifyToken } from "../../presentation/middleware/user/verify-token.js";
import {
  UserMapper,
  type IUserMapper,
} from "../../application/mappers/user.js";
import {
  UsersMapper,
  type IUsersMapper,
} from "../../application/mappers/users.js";
import {
  CheckBlockedUserMiddleware,
  type ICheckBlockedUserMiddleware,
} from "../../presentation/middleware/user/check-blocked-user.js";
import type { IUserRepository } from "../../application/interfaces/user-repository.js";
import {
  RefreshAccessTokenUC,
  type IRefreshAccessTokenUC,
} from "../../application/use-cases/user/auth/refresh-token.js";

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

  createStoreTempUC(): StoreTempUserAndSentOtpUC {
    const otpConfig = {
      ttlSeconds: this.config.otpTtlSeconds,
      emailSubject: this.config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    };

    return new StoreTempUserAndSentOtpUC(
      this.createOtpStore(),
      this.createEmailService(),
      this.createHashService(),
      this.createUserRepository(),
      otpConfig
    );
  }

  createVerifyUserUC(): VerifyOtpAndCreateUserUC {
    return new VerifyOtpAndCreateUserUC(
      this.createOtpStore(),
      this.createHashService(),
      this.createUserRepository(),
      this.createAuthService()
    );
  }

  createLoginUC(): LoginUserUC {
    return new LoginUserUC(this.createAuthService(), this.createUserMapper());
  }

  createForgotUC(): ForgotPasswordUC {
    const otpConfig = {
      ttlSeconds: this.config.otpTtlSeconds,
      emailSubject: this.config.emailSubject,
      emailTemplate: (otp: string, expiryMinutes: number) =>
        `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    };

    return new ForgotPasswordUC(
      this.createAuthService(),
      this.createHashService(),
      this.createEmailService(),
      this.createOtpStore(),
      otpConfig
    );
  }

  createVerifyUC(): VerifyOtpUC {
    return new VerifyOtpUC(this.createAuthService());
  }

  createResetPasswordUC(): ResetPasswordUC {
    return new ResetPasswordUC(
      this.createHashService(),
      this.createAuthService()
    );
  }

  createRefreshAccessTokenUC = () : IRefreshAccessTokenUC => {
    return new RefreshAccessTokenUC(this.createTokenService());
  }

  // auth controller
  createAuthController(): AuthController {
    return new AuthController(
      this.createStoreTempUC(),
      this.createVerifyUserUC(),
      this.createLoginUC(),
      this.createForgotUC(),
      this.createVerifyUC(),
      this.createResetPasswordUC(),
      this.createRefreshAccessTokenUC(),
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
