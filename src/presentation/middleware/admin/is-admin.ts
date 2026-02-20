import type { NextFunction, Request, Response } from "express";
import type { ITokenService } from "../../../application/providers/token-service.js";
import { AppError } from "../../../utils/app-error.js";
import type { ITokenPayload } from "../../../application/interfaces/jwt/jwt-payload.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { UserRole } from "../../../domain/enums/user-role.js";
import { ErrorCode } from "../../../domain/enums/constants/error-code.js";
import logger from "../../../utils/logger.js";

interface AuthRequest extends Request {
  admin?: ITokenPayload;
}

export class VerifyAdmin {
  constructor(private _tokenService: ITokenService) {}

  isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.cookies;

      if (!accessToken) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.UNAUTHORIZED,
        );
      }

      const decoded = await this._tokenService.verifyAccessToken(accessToken);
      if (!decoded) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.UNAUTHORIZED,
          undefined,
          ErrorCode.AUTHORIZATION_ERROR,
        );
      }

      if (decoded.role !== UserRole.ADMIN) {
        throw new AppError(
          ResponseMessages.Forbidden,
          HttpStatusCode.FORBIDDEN,
          undefined,
          ErrorCode.AUTHORIZATION_ERROR,
        );
      }
      req.admin = decoded;

      return next();
    } catch (err) {
      next(err);
    }
  };
}
