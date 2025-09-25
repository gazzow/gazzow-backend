import type { NextFunction, Request, Response } from "express";
import { env } from "../../../infrastructure/config/env.js";
import type {
  IForgotPasswordRequestDTO,
  IForgotPasswordResponseDTO,
} from "../../../domain/dtos/user.js";
import logger from "../../../utils/logger.js";
import { AppError } from "../../../utils/app-error.js";
import { UserStatus } from "../../../domain/enums/user-role.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import type { IRegisterUserUseCase } from "../../../application/interfaces/user/auth/register-user.js";
import type { IVerifyUserUseCase } from "../../../application/interfaces/user/auth/verify-user.js";
import type { ILoginUserUseCase } from "../../../application/interfaces/user/auth/login-user.js";
import type { IForgotPasswordUseCase } from "../../../application/interfaces/user/auth/forgot-password.js";
import type { IVerifyOtpUseCase } from "../../../application/interfaces/user/auth/verify-otp.js";
import type { IResetPasswordUseCase } from "../../../application/interfaces/user/auth/reset-password.js";
import type { IRefreshAccessTokenUseCase } from "../../../application/interfaces/user/auth/refresh-token.js";
import type { IUser } from "../../../domain/entities/user.js";
import type { IGoogleCallbackUseCase } from "../../../application/interfaces/user/auth/google-callback.js";

export class AuthController {
  constructor(
    private _registerUserUseCase: IRegisterUserUseCase,
    private _verifyUserUseCase: IVerifyUserUseCase,
    private _loginUserUseCase: ILoginUserUseCase,
    private _forgotPasswordUseCase: IForgotPasswordUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _resetPasswordUseCase: IResetPasswordUseCase,
    private _refreshAccessTokenUseCase: IRefreshAccessTokenUseCase,
    private _googleCallbackUseCase: IGoogleCallbackUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    console.log("User Register API hit");
    try {
      const result = await this._registerUserUseCase.execute(req.body);
      // message:  "Verification code sent successfully!"
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      }
    }
  };

  verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Verify Otp API hit");

    try {
      const { email, otp } = req.body;
      const result = await this._verifyUserUseCase.execute(email, otp);

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
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, user, message });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`OTP verification failed: ${error.message}`);
        next(error);
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("login route hit");

    try {
      const result = await this._loginUserUseCase.execute(req.body);

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

      res.status(HttpStatusCode.OK).json({ success: true, user, message });
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Login error: ${err.message}`);
        next(err);
      }
    }
  };

  forgotPassword = async (
    req: Request<object, IForgotPasswordResponseDTO, IForgotPasswordRequestDTO>,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("Forgot password api hit");

    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError(
          ResponseMessages.BadRequest,
          HttpStatusCode.BAD_REQUEST
        );
      }

      const result = await this._forgotPasswordUseCase.execute(email);

      logger.info(`response result: ${JSON.stringify(result)}`);

      res.status(HttpStatusCode.OK).json(result);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`forgot-password error: ${e.message}`);
        next(e);
      }
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("verify otp api hit");

    try {
      const { email, otp } = req.body;

      const result = await this._verifyOtpUseCase.execute({ email, otp });
      logger.debug(`result verifyOtp: ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`forgot-password error: ${e.message}`);
        next(e);
      }
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("reset password api hit");

    try {
      const { email, password } = req.body;

      const result = await this._resetPasswordUseCase.execute({
        email,
        password,
      });

      logger.info(`result reset-password: ${JSON.stringify(result)}`);

      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`reset-password error: ${error.message}`);
        next(error);
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
        await this._refreshAccessTokenUseCase.execute(refreshToken);

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

  logout = (req: Request, res: Response) => {
    logger.debug("Logout api got hit 🚀");

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res
      .status(HttpStatusCode.OK)
      .json({ success: true, message: ResponseMessages.LogoutSuccess });
  };

  googleCallback = async (req: Request, res: Response) => {
    const user = req.user as IUser;

    const result = await this._googleCallbackUseCase.execute(user);

    const { accessToken, refreshToken} = result;

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

    res.status(HttpStatusCode.OK).redirect(`${env.base_url}/success`);
  };
}
