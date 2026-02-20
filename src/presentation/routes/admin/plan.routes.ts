import express from "express";
import { AdminDependencyContainer } from "../../../infrastructure/dependency-injection/admin-dependency-container.js";
import { PlanDependencyContainer } from "../../../infrastructure/dependency-injection/admin/plan.container.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createPlanSchema } from "../../validators/admin/create-plan.validator.js";

const router = express.Router();

const adminContainer = new AdminDependencyContainer();
const verifyMiddleware = adminContainer.createVerifyAdminMiddleware();

const planContainer = new PlanDependencyContainer();
const planController = planContainer.createPlanController();

router.post(
  "/",
  verifyMiddleware.isAdmin,
  validate(createPlanSchema),
  planController.createPlan,
);
router.get("/", verifyMiddleware.isAdmin, planController.listPlan);

router.get("/:planId", verifyMiddleware.isAdmin, planController.getPlan);
router.put("/:planId", verifyMiddleware.isAdmin, planController.updatePlan);
router.patch("/:planId", verifyMiddleware.isAdmin, planController.updateStatus);

export default router;
