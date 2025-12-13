import express from "express";
import { WebhookDependencyContainer } from "../../infrastructure/dependency-injection/webhook-dependency-container.js";

const router = express.Router();

const webhookContainer = new WebhookDependencyContainer();
const stripeWebhookController =
  webhookContainer.createStripeWebhookController();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeWebhookController.webhookHandler
);

export default router;
