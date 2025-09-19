import type { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger.js";
import { AppError } from "../../../utils/app-error.js";
import type { IUserPublic } from "../../../domain/entities/user.js";
import type { IUpdateUserProfileUseCase } from "../../../application/interfaces/user/profile/setup-profile.js";
import type { IGetUserProfileUseCase } from "../../../application/interfaces/user/profile/get-profile.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface AuthRequest extends Request {
  user?: IUserPublic;
}

export class UserController {
  constructor(
    private _updateUserProfileUseCase: IUpdateUserProfileUseCase,
    private _getUserProfileUseCase: IGetUserProfileUseCase
  ) {}

  updateProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("Update profile api hit🚀");
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const profileData = req.body;

      const result = await this._updateUserProfileUseCase.execute(
        userId,
        profileData
      );

      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("Get user profile api hit🚀");
    try {
      const id = req.user?.id;
      if (!id) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.UNAUTHORIZED
        );
      }

      logger.debug(`user id: ${id}`);

      const result = await this._getUserProfileUseCase.execute(id);
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
