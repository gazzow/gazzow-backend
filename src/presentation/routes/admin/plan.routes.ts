import express from "express";
import { AdminDependencyContainer } from "../../../infrastructure/dependency-injection/admin-dependency-container.js";
import { PlanDependencyContainer } from "../../../infrastructure/dependency-injection/admin/plan.container.js";

const router = express.Router();

const adminContainer = new AdminDependencyContainer();
const verifyMiddleware = adminContainer.createVerifyAdminMiddleware();

const planContainer = new PlanDependencyContainer();
const planController = planContainer.createPlanController();

router.post("/", verifyMiddleware.isAdmin, planController.createPlan);
router.get("/", verifyMiddleware.isAdmin, planController.listPlan);

router.get("/:planId", verifyMiddleware.isAdmin, planController.getPlan);
router.put("/:planId", verifyMiddleware.isAdmin, planController.updatePlan);


export default router;
