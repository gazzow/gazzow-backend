// src/presentation/routes/notificationRoutes.ts
import { Router } from "express";
import { NotificationDependencyContainer } from "../../infrastructure/dependency-injection/notification.container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";

const router = Router();

const notificationController = new NotificationDependencyContainer();
const controller = notificationController.createNotificationController();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();

router.post("/register-token", controller.registerToken);

router.post(
  "/delete-token",
  tokenMiddleware.verifyToken,
  controller.deleteToken
);

router.get("/", tokenMiddleware.verifyToken, controller.listNotifications);

router.patch(
  "/:notificationId",
  tokenMiddleware.verifyToken,
  controller.markAsRead
);
export default router;
