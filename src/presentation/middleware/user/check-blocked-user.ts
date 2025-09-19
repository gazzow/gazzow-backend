import type { NextFunction, Request, Response } from "express";
import type { IUserRepository } from "../../../application/interfaces/repository/user-repository.js";
import logger from "../../../utils/logger.js";
import { AppError } from "../../../utils/app-error.js";
import { UserStatus } from "../../../domain/enums/user-role.js";
import type { ITokenPayload } from "../../../application/interfaces/jwt/jwt-payload.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";

export interface ICheckBlockedUserMiddleware {
  isBlocked(req: Request, res: Response, next: NextFunction): void;
}

interface AuthRequest extends Request {
  user?: ITokenPayload;
}

export class CheckBlockedUserMiddleware implements ICheckBlockedUserMiddleware {
  constructor(private _userRepository: IUserRepository) {}

  isBlocked = async (req: AuthRequest, res: Response, next: NextFunction) => {
    logger.debug("is blocked middleware check");
    try {
      if (!req.user) {
        throw new AppError(ResponseMessages.Unauthorized, HttpStatusCode.UNAUTHORIZED);
      }

      logger.debug(`req user data: ${JSON.stringify(req.user)}`);
      const { id } = req.user;
      logger.debug(`user id : ${id}`);
      if(!id){
        throw new AppError(ResponseMessages.Unauthorized, HttpStatusCode.UNAUTHORIZED)
      }
      const user = await this._userRepository.findById(id);
      if (!user) {
        throw new AppError(ResponseMessages.UserNotFound, HttpStatusCode.NOT_FOUND);
      }

      if (user.status === UserStatus.BLOCKED) {
        logger.warn(`Blocked user tried to access: ${req.user.email}`);
        throw new AppError(ResponseMessages.UserBlocked, HttpStatusCode.FORBIDDEN);
      }
      return next();
    } catch (error) {
      logger.error("Error in CheckBlockedUser middleware:", error);
      next(error);
    }
  };
}
