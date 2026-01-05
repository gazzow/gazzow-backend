import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "../../infrastructure/config/env.js";
import { errorHandler } from "../middleware/error-handler.js";

import userRoutes from "../routes/user/user-routes.js";
import adminRoutes from "../routes/admin/admin-routes.js";
import projectRoutes from "../routes/project-routes.js";
import contributorRoutes from "../routes/contributor-routes.js";
import paymentRoutes from "../routes/payment-routes.js";
import webhookRoutes from "../routes/webhook-route.js";
import taskCommentRoutes from "../routes/task-comment.routes.js";
import planRoutes from "../routes/admin/plan.routes.js";
import subscriptionRoutes from "../routes/subscription.routes.js";
import notificationRoutes from "../routes/notification.routes.js";
import subscriptionManagementRoutes from "../routes/admin/subscription-management.routes.js";
import favoriteRoutes from "../routes/favorite.routes.js";
import teamChatRoutes from "../routes/team-chat.routes.js";
import DashboardRoutes from "../routes/admin/dashboard.routes.js";
import adminPaymentRoutes from "../routes/admin/payment.routes.js";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: env.base_url,
    credentials: true,
  })
);

app.use("/api/webhook", webhookRoutes);

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/comments", taskCommentRoutes);
app.use("/api/contributor", contributorRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/team-chat", teamChatRoutes);

// Admin Routes
app.use("/api/admin/plans", planRoutes);
app.use("/api/admin/subscriptions", subscriptionManagementRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/dashboard", DashboardRoutes);

app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;
