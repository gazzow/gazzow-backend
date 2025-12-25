// src/presentation/controllers/NotificationController.ts

import type { NextFunction, Request, Response } from "express";

import logger from "../../utils/logger.js";
import { ApiResponse } from "../common/api-response.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import type { IRegisterTokenUseCase } from "../../application/use-cases/notification/register-token.js";
import type { IListNotificationUseCase } from "../../application/use-cases/notification/list-notifications.js";
import type { IMarkNotificationAsReadUseCase } from "../../application/use-cases/notification/mark-notification-as-read.js";

export class NotificationController {
  constructor(
    private _registerTokenUseCase: IRegisterTokenUseCase,
    private _listNotificationUseCase: IListNotificationUseCase,
    private _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase
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
}
