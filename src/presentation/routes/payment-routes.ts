import express from "express";
import { PaymentDependencyContainer } from "../../infrastructure/dependency-injection/payment-dependency-container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";

const router = express.Router();

const paymentContainer = new PaymentDependencyContainer();
const paymentController = paymentContainer.createPaymentController();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();

router.post(
  "/connect",
  tokenMiddleware.verifyToken,
  paymentController.connectAccount
);
router.get(
  "/onboarding-link",
  tokenMiddleware.verifyToken,
  paymentController.onboardingLink
);

router.get(
  "/check-onboarding-status",
  tokenMiddleware.verifyToken,
  paymentController.checkOnboardingStatus
);

router.post(
  "/task-checkout-session",
  tokenMiddleware.verifyToken,
  paymentController.taskCheckoutSession
);
router.post(
  "/subscription-checkout",
  tokenMiddleware.verifyToken,
  paymentController.subscriptionCheckout
);

export default router;
