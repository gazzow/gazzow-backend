import type { NextFunction, Request, Response } from "express";

import logger from "../../utils/logger.js";
import { ApiResponse } from "../common/api-response.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import type { IListNotificationUseCase } from "../../application/use-cases/notification/list-notifications.js";
import type { IGetUnreadNotificationCountUseCase } from "../../application/interfaces/usecase/notification/get-count.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import type { IMarkNotificationAsReadUseCase } from "../../application/interfaces/usecase/notification/mark-notification-as-read.js";
import type { IMarkAllNotificationsAsReadUseCase } from "../../application/interfaces/usecase/notification/mark-all-notifications-as -read.js";

export class NotificationController {
  constructor(
    private _listNotificationUseCase: IListNotificationUseCase,
    private _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
    private _getUnreadNotificationCountUseCase: IGetUnreadNotificationCountUseCase,
    private _markAllNotificationsAsReadUseCase: IMarkAllNotificationsAsReadUseCase,
  ) {}

  listNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    logger.debug("List notification API hit🚀");
    const userId = req.user!.id;
    try {
      const { data } = await this._listNotificationUseCase.execute({ userId });

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedNotifications, data));
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    logger.debug("Mark notification as read API hit🚀");
    const notificationId = req.params.notificationId!;
    try {
      const { data } = await this._markNotificationAsReadUseCase.execute({
        notificationId,
      });

      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.success(ResponseMessages.NotificationMarkedAsRead, data),
        );
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    logger.debug("Mark All notifications as read API hit🚀");

    const userId = req.user!.id;
    try {
      await this._markAllNotificationsAsReadUseCase.execute({
        userId,
      });

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.NotificationMarkedAsRead));
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    logger.debug("Get Unread Notification Count API hit🚀");
    const userId = req.user!.id;
    try {
      const count =
        await this._getUnreadNotificationCountUseCase.execute(userId);
      res.status(HttpStatusCode.OK).json(
        ApiResponse.success(ResponseMessages.UnreadNotificationCountRetrieved, {
          count,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
