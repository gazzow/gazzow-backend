// src/presentation/controllers/NotificationController.ts

import type { NextFunction, Request, Response } from "express";

import logger from "../../utils/logger.js";
import { ApiResponse } from "../common/api-response.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import type { IRegisterTokenUseCase } from "../../application/use-cases/notification/register-token.js";
import type { IListNotificationUseCase } from "../../application/use-cases/notification/list-notifications.js";
import type { IMarkNotificationAsReadUseCase } from "../../application/use-cases/notification/mark-notification-as-read.js";
import type { IDeleteFirebaseTokenUseCase } from "../../application/use-cases/notification/delete-token.js";
import { FCM_DEVICES } from "../../domain/enums/FCMToken.js";
import type { IGetUnreadNotificationCountUseCase } from "../../application/interfaces/usecase/notification/get-count.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";

export class NotificationController {
  constructor(
    private _registerTokenUseCase: IRegisterTokenUseCase,
    private _listNotificationUseCase: IListNotificationUseCase,
    private _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
    private _deleteTokenUseCase: IDeleteFirebaseTokenUseCase,
    private _getUnreadNotificationCountUseCase: IGetUnreadNotificationCountUseCase
  ) {}

  /**
   * Register FCM token
   */
  registerToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug("Register Token API hit🚀");
    try {
      const { fcmToken, userId, deviceType } = req.body;

      if (!fcmToken || !userId) {
        res.status(400).json({
          success: false,
          message: "fcmToken and userId are required",
        });
        return;
      }

      const dto = {
        userId,
        fcmToken,
        deviceType: deviceType,
      };

      const { data } = await this._registerTokenUseCase.execute(dto);

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success("FCM token registered successfully", data));
    } catch (error) {
      next(error);
    }
  };

  listNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug("List notification API hit🚀");
    const userId = req.user!.id;
    try {
      const { data } = await this._listNotificationUseCase.execute({ userId });

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success("List Notifications Successfully", data));
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug("Mark notification as Read API hit🚀");
    const notificationId = req.params.notificationId!;
    try {
      const { data } = await this._markNotificationAsReadUseCase.execute({
        notificationId,
      });

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success("Notification marked as read", data));
    } catch (error) {
      next(error);
    }
  };

  deleteToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug("Delete Token API hit🚀");
    try {
      const { deviceType } = req.body;
      const userId = req.user!.id;

      const dto = {
        userId,
        deviceType: deviceType ?? FCM_DEVICES.WEB,
      };

      await this._deleteTokenUseCase.execute(dto);

      res
        .status(HttpStatusCode.NO_CONTENT)
        .json(ApiResponse.success("Firebase Token deleted successfully"));
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug("Get Unread Notification Count API hit🚀");
    const userId = req.user!.id;
    try {
      const count =
        await this._getUnreadNotificationCountUseCase.execute(userId);
      res.status(HttpStatusCode.OK).json(
        ApiResponse.success(ResponseMessages.UnreadNotificationCountRetrieved, {
          count,
        })
      );
    } catch (error) {
      next(error);
    }
  };
}
