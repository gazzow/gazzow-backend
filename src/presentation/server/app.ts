import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRoutes from "../routes/user/user-routes.js";
import adminRoutes from "../routes/admin/admin-routes.js";
import { env } from "../../infrastructure/config/env.js";
import { errorHandler } from "../middleware/user/error-handler.js";

const app = express();

app.use(cookieParser())
app.use(
  cors({
    origin: env.base_url,
    credentials: true,
  })
);
app.use(express.json());


app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;
