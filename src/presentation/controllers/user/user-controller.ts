import type { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger.js";
import { AppError } from "../../../utils/app-error.js";
import type { IUpdateUserProfileUseCase } from "../../../application/interfaces/usecase/user/profile/update-profile.js";
import type { IGetUserProfileUseCase } from "../../../application/interfaces/usecase/user/profile/get-profile.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { pickAllowedFields } from "../../../infrastructure/utils/pick-allowed-fields.js";
import type { IUpdateProfileRequestDTO } from "../../../application/dtos/user/user.js";
import { ApiResponse } from "../../common/api-response.js";

export class UserController {
  constructor(
    private _updateUserProfileUseCase: IUpdateUserProfileUseCase,
    private _getUserProfileUseCase: IGetUserProfileUseCase
  ) {}

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
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

      const { data } = await this._getUserProfileUseCase.execute(id);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.UserRetrieved, data));
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Update profile api hit🚀");
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(
          ResponseMessages.Unauthorized,
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const allowedFields: (keyof IUpdateProfileRequestDTO)[] = [
        "name",
        "bio",
        "techStacks",
        "learningGoals",
        "experience",
        "developerRole",
        "imageUrl",
      ];

      const profileData = pickAllowedFields<IUpdateProfileRequestDTO>(
        req.body,
        allowedFields
      );

      logger.debug(`Profile date to update: ${JSON.stringify(profileData)}`);

      const {data} = await this._updateUserProfileUseCase.execute(
        userId,
        profileData
      );

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.ProfileUpdated, data));
    } catch (error) {
      next(error);
    }
  };
}
