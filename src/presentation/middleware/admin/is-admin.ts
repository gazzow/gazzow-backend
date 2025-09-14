import type { NextFunction, Request, Response } from "express";
import type { ITokenService } from "../../../application/providers/token-service.js";
import logger from "../../../utils/logger.js";
import { AppError } from "../../../utils/app-error.js";
import type { ITokenPayload } from "../../../application/interfaces/jwt/jwt-payload.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { UserRole } from "../../../domain/enums/user-role.js";
import { env } from "../../../infrastructure/config/env.js";

interface AuthRequest extends Request {
  admin?: ITokenPayload;
}


export class VerifyAdmin {
  constructor(private tokenService: ITokenService) {}

  isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.cookies;
      logger.debug(`admin access token extracted from cookie: ${accessToken}`);

      if (!accessToken) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const decoded = await this.tokenService.verifyAccessToken(accessToken);
      logger.info(`decoded admin token data: ${JSON.stringify(decoded)}`)
      if (decoded.role !== UserRole.ADMIN || decoded.email !== env.admin_email) {
        throw new AppError(
          ResponseMessages.Forbidden,
          HttpStatusCode.FORBIDDEN
        );
      }

      req.admin = decoded;

      return next();
    } catch (err) {
      logger.error("JWT verification failed:", err);
      next(err);
    }
  };
}
