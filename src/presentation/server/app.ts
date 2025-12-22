import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/user/user-routes.js";
import adminRoutes from "../routes/admin/admin-routes.js";
import projectRoutes from "../routes/project-routes.js";
import contributorRoutes from "../routes/contributor-routes.js";
import paymentRoutes from "../routes/payment-routes.js";
import webhookRoutes from "../routes/webhook-route.js";
import taskCommentRoutes from "../routes/task-comment.routes.js";
import planRoutes from "../routes/admin/plan.routes.js";
import { env } from "../../infrastructure/config/env.js";
import { errorHandler } from "../middleware/error-handler.js";

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

app.use("/api/admin", adminRoutes);
app.use("/api/admin/plan", planRoutes);

app.use(errorHandler);

export default app;
