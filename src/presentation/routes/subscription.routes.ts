import express from "express";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";
import { SubscriptionDependencyContainer } from "../../infrastructure/dependency-injection/subscription-container.js";

const router = express.Router();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();
const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

const subscriptionContainer = new SubscriptionDependencyContainer();
const subscriptionController =
  subscriptionContainer.createSubscriptionController();

router.get(
  "/",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  subscriptionController.getSubscription
);

router.get(
  "/plans",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  subscriptionController.listPlans
);

export default router;
