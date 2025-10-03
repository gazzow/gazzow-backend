import type { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger.js";
import { env } from "../../../infrastructure/config/env.js";
import type { IAdminLoginUseCase } from "../../../application/interfaces/usecase/admin/auth/login.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../../common/api-response.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";

export class AdminAuthController {
  constructor(private _adminLoginUseCase: IAdminLoginUseCase) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Admin login api hit🚀");

    try {
      const { accessToken, refreshToken, data } =
        await this._adminLoginUseCase.execute(req.body);
        
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
      
      res.status(HttpStatusCode.OK).json(ApiResponse.success(ResponseMessages.LoginSuccess, data));
    } catch (error) {
      next(error);
    }
  };
}
