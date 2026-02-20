import type { NextFunction, Request, Response } from "express";
import type { ITokenService } from "../../../application/providers/token-service.js";
import logger from "../../../utils/logger.js";
import { AppError } from "../../../utils/app-error.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { UserRole } from "../../../domain/enums/user-role.js";
import { ErrorCode } from "../../../domain/enums/constants/error-code.js";

export class VerifyToken {
  constructor(private tokenService: ITokenService) {}

  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.cookies;

      if (!accessToken) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.UNAUTHORIZED,
        );
      }

      const decoded = await this.tokenService.verifyAccessToken(accessToken);
      if (!decoded) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.UNAUTHORIZED,
        );
      }

      if (decoded.role !== UserRole.USER) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.FORBIDDEN,
          undefined,
          ErrorCode.AUTHENTICATION_ERROR,
        );
      }

      req.user = decoded;

      return next();
    } catch (err) {
      logger.error("JWT verification failed:", err);
      next(err);
    }
  };
}
