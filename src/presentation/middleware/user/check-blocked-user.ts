import type { NextFunction, Request, Response } from "express";
import type { IUserRepository } from "../../../application/interfaces/repository/user-repository.js";
import logger from "../../../utils/logger.js";
import { AppError } from "../../../utils/app-error.js";
import { UserStatus } from "../../../domain/enums/user-role.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ErrorCode } from "../../../domain/enums/constants/error-code.js";

export interface ICheckBlockedUserMiddleware {
  isBlocked(req: Request, res: Response, next: NextFunction): void;
}

export class CheckBlockedUserMiddleware implements ICheckBlockedUserMiddleware {
  constructor(private _userRepository: IUserRepository) {}

  isBlocked = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("is blocked middleware check");
    try {
      if (!req.user) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.UNAUTHORIZED
        );
      }

      logger.debug(`req user data: ${JSON.stringify(req.user)}`);

      const user = await this._userRepository.findById(req.user.id);
      if (!user) {
        throw new AppError(
          ResponseMessages.UserNotFound,
          HttpStatusCode.NOT_FOUND
        );
      }

      if (user.status === UserStatus.BLOCKED) {
        logger.warn(`Blocked user tried to access: ${req.user.email}`);
        throw new AppError(
          ResponseMessages.UserBlocked,
          HttpStatusCode.FORBIDDEN,
          undefined,
          ErrorCode.USER_BLOCKED
        );
      }
      return next();
    } catch (error) {
      logger.error("Error in CheckBlockedUser middleware:", error);
      next(error);
    }
  };
}
