import express from "express";
import { AdminDependencyContainer } from "../../../infrastructure/dependency-injection/admin-dependency-container.js";
import { SubscriptionManagementDependencyContainer } from "../../../infrastructure/dependency-injection/admin/subscription-management.container.js";

const router = express.Router();

const adminContainer = new AdminDependencyContainer();
const verifyMiddleware = adminContainer.createVerifyAdminMiddleware();

const subscriptionContainer = new SubscriptionManagementDependencyContainer();
const subscriptionController =
  subscriptionContainer.createSubscriptionController();

router.get(
  "/",
  verifyMiddleware.isAdmin,
  subscriptionController.listSubscriptions
);

router.put(
  "/:subscriptionId",
  verifyMiddleware.isAdmin,
  subscriptionController.cancelSubscription
);

export default router;
