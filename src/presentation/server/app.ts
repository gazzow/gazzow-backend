import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "../../infrastructure/config/env.js";
import { errorHandler } from "../middleware/error-handler.js";
import webhookRoutes from "../routes/webhook.route.js";

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

app.use(errorHandler);

export default app;
