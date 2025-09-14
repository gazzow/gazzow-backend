import type { NextFunction, Request, Response } from "express";
import { env } from "../../../infrastructure/config/env.js";
import type { StoreTempUserAndSentOtpUC } from "../../../application/use-cases/user/auth/store-temp-user-and-send-otp.js";
import type { VerifyOtpAndCreateUserUC } from "../../../application/use-cases/user/auth/verify-otp-and-create-user.js";
import type { LoginUserUC } from "../../../application/use-cases/user/auth/login-user.js";
import type { ForgotPasswordUC } from "../../../application/use-cases/user/auth/forgot-password.js";
import type {
  IForgotPasswordRequestDTO,
  IForgotPasswordResponseDTO,
} from "../../../domain/dtos/user.js";
import logger from "../../../utils/logger.js";
import type { VerifyOtpUC } from "../../../application/use-cases/user/auth/verify-otp.js";
import type { ResetPasswordUC } from "../../../application/use-cases/user/auth/reset-password.js";
import { AppError } from "../../../utils/app-error.js";
import { UserStatus } from "../../../domain/enums/user-role.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import type { IRefreshAccessTokenUC } from "../../../application/use-cases/user/auth/refresh-token.js";

export class AuthController {
  constructor(
    private storeTempUserAndSendOtpUC: StoreTempUserAndSentOtpUC,
    private verifyOtpAndCreateUserUC: VerifyOtpAndCreateUserUC,
    private loginUserUC: LoginUserUC,
    private forgotPasswordUC: ForgotPasswordUC,
    private verifyOtpUC: VerifyOtpUC,
    private resetPasswordUC: ResetPasswordUC,
    private refreshAccessTokenUc: IRefreshAccessTokenUC
  ) {}

  register = async (req: Request, res: Response) => {
    console.log("User Register API hit");
    try {
      const result = await this.storeTempUserAndSendOtpUC.execute(req.body);
      // message:  "Verification code sent successfully!"
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        res.status(400).json({ success: false, message: error.message });
      }
    }
  };

  verifyUser = async (req: Request, res: Response) => {
    logger.debug("Verify Otp API hit");

    try {
      const { email, otp } = req.body;
      const result = await this.verifyOtpAndCreateUserUC.execute(email, otp);

      // extract access and refresh token to store it on http-only cookie then
      const { accessToken, refreshToken, user, message } = result;

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: env.jwt.access_expires, // 15 minutes
        sameSite: "strict",
        secure: env.node_env,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: env.jwt.refresh_expires, // 7 days
        sameSite: "strict",
        secure: env.node_env,
      });

      logger.info(`Created User data: ${JSON.stringify(user)} `);
      return res.status(201).json({ success: true, user, message });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`OTP verification failed: ${error.message}`);
        res.status(400).json({ success: false, message: error.message });
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("login route hit");

    try {
      const result = await this.loginUserUC.execute(req.body);

      const { accessToken, refreshToken, user, message } = result;
      logger.info(`User login data: ${JSON.stringify(user)}`);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: env.jwt.access_expires, // 15 minutes
        sameSite: "strict",
        secure: env.node_env,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: env.jwt.refresh_expires, // 7 days
        sameSite: "strict",
        secure: env.node_env,
      });

      if (user.status === UserStatus.BLOCKED) {
        throw new AppError("Access Denied: User is blocked", 403);
      }
      res.status(200).json({ success: true, user, message });
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Login error: ${err.message}`);
        next(err);
      }
    }
  };

  forgotPassword = async (
    req: Request<object, IForgotPasswordResponseDTO, IForgotPasswordRequestDTO>,
    res: Response
  ) => {
    logger.debug("Forgot password api hit");

    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ success: false, message: "Email required!" });
      }

      const result = await this.forgotPasswordUC.execute(email);

      logger.info(`response result: ${JSON.stringify(result)}`);

      res.status(200).json(result);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`forgot-password error: ${e.message}`);
        res.status(400).json({ success: false, message: e.message });
      }
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    logger.debug("verify otp api hit");

    try {
      const { email, otp } = req.body;

      const result = await this.verifyOtpUC.execute(email, otp);
      logger.debug(`result verifyOtp: ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`forgot-password error: ${e.message}`);
        res.status(400).json({ success: false, message: e.message });
      }
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    logger.info("reset password api hit");

    try {
      const { email, password } = req.body;

      const result = await this.resetPasswordUC.execute(email, password);

      logger.info(`result reset-password: ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`reset-password error: ${error.message}`);
        res.status(400).json({ success: false, message: error.message });
      }
    }
  };

  refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug(`Refresh Token api hit🚀`);
    try {
      const { refreshToken } = req.cookies;
      logger.info(`Refresh token extracted from cookie: ${refreshToken}`);
      if (!refreshToken) {
        throw new AppError(
          ResponseMessages.NoRefreshToken,
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const { newAccessToken, ...response } =
        await this.refreshAccessTokenUc.execute(refreshToken);

      // set new access token cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: env.jwt.access_expires, // 15 minutes
        sameSite: "strict",
        secure: env.node_env,
      });

      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
