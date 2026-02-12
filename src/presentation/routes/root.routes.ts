import { Router } from "express";

import userRoutes from "./user/user.routes.js";
import adminRoutes from "./admin/admin.routes.js";
import paymentRoutes from "./payment.routes.js";
import taskCommentRoutes from "./task-comment.routes.js";
import contributorRoutes from "./contributor.routes.js";
import subscriptionRoutes from "./subscription.routes.js";
import notificationRoutes from "./notification.routes.js";
import favoriteRoutes from "./favorite.routes.js";
import planRoutes from "./admin/plan.routes.js";
import subscriptionManagementRoutes from "./admin/subscription-management.routes.js";
import DashboardRoutes from "./admin/dashboard.routes.js";
import adminPaymentRoutes from "./admin/payment.routes.js";
import type { SocketGateway } from "../../infrastructure/config/socket/socket-gateway.js";
import { createTeamChatRoutes } from "./team-chat.routes.js";
import { createProjectRouter } from "./project.routes.js";

export const createRootRoutes = (socketGateway: SocketGateway) => {
  const router = Router();

  // Public routes
  router.use("/", userRoutes);
  router.use("/payments", paymentRoutes);
  router.use("/projects", createProjectRouter(socketGateway));
  router.use("/comments", taskCommentRoutes);
  router.use("/contributor", contributorRoutes);
  router.use("/subscriptions", subscriptionRoutes);
  router.use("/notifications", notificationRoutes);
  router.use("/favorites", favoriteRoutes);
  router.use("/team-chat", createTeamChatRoutes(socketGateway));

  // Admin routes
  router.use("/admin/plans", planRoutes);
  router.use("/admin/subscriptions", subscriptionManagementRoutes);
  router.use("/admin/payments", adminPaymentRoutes);
  router.use("/admin/dashboard", DashboardRoutes);
  router.use("/admin", adminRoutes);

  return router;
};
