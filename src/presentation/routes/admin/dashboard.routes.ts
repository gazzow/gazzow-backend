import { Router } from "express";
import { AdminDependencyContainer } from "../../../infrastructure/dependency-injection/admin-dependency-container.js";
import { AdminDashboardDependencyContainer } from "../../../infrastructure/dependency-injection/admin/dashboard.container.js";

const router = Router();

const adminContainer = new AdminDependencyContainer();
const verifyMiddleware = adminContainer.createVerifyAdminMiddleware();

const dashboardContainer = new AdminDashboardDependencyContainer();
const dashboardController = dashboardContainer.createDashboardController();

router.get("/", verifyMiddleware.isAdmin, dashboardController.dashboardStats);

export default router;
