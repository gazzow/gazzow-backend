import express from "express";
import { PaymentDependencyContainer } from "../../infrastructure/dependency-injection/payment.container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";

const router = express.Router();

const paymentContainer = new PaymentDependencyContainer();
const paymentController = paymentContainer.createPaymentController();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();
const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

router.get("/", tokenMiddleware.verifyToken, paymentController.listPayments);

router.post(
  "/connect",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  paymentController.connectAccount
);

router.get(
  "/onboarding-link",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  paymentController.onboardingLink
);

router.get(
  "/check-onboarding-status",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  paymentController.checkOnboardingStatus
);

router.post(
  "/task-checkout-session",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  paymentController.taskCheckoutSession
);

router.post(
  "/subscription-checkout",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  paymentController.subscriptionCheckout
);

export default router;
