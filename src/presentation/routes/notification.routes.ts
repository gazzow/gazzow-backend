import { Router } from "express";
import { NotificationDependencyContainer } from "../../infrastructure/dependency-injection/notification.container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";
import type { IRealtimeGateway } from "../../infrastructure/config/socket/socket-gateway.js";

export const createNotificationRouter = (socketGateway: IRealtimeGateway) => {
  const router = Router();

  const notificationController = new NotificationDependencyContainer(
    socketGateway,
  );
  const controller = notificationController.createNotificationController();

  const authContainer = new AuthDependencyContainer();
  const tokenMiddleware = authContainer.createTokenMiddleware();
  const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

  router.get(
    "/",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    controller.listNotifications,
  );

  router.patch(
    "/:notificationId",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    controller.markAsRead,
  );

  router.get(
    "/unread-count",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    controller.getUnreadCount,
  );

  return router;
};
