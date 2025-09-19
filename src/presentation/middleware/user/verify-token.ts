import type { NextFunction, Request, Response } from "express";
import type { ITokenService } from "../../../application/providers/token-service.js";
import logger from "../../../utils/logger.js";
import { AppError } from "../../../utils/app-error.js";
import type { ITokenPayload } from "../../../application/interfaces/jwt/jwt-payload.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";

interface AuthRequest extends Request {
  user?: ITokenPayload;
}

export class VerifyToken {
  constructor(private tokenService: ITokenService) {}

  verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.cookies;
      // logger.info(`access token extracted from cookie: ${accessToken}`)

      if (!accessToken) {
        throw new AppError(ResponseMessages.Unauthorized, HttpStatusCode.UNAUTHORIZED);
      }

      const decoded = await this.tokenService.verifyAccessToken(accessToken);
      // logger.info(`decoded token data: ${JSON.stringify(decoded)}`)
      if(!decoded){
        throw new AppError(ResponseMessages.Unauthorized, HttpStatusCode.UNAUTHORIZED);
      }

      req.user = decoded;

      return next();
    } catch (err) {
      logger.error("JWT verification failed:", err);
      next(err);
    }
  };
}
