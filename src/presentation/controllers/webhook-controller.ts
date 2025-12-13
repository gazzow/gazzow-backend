import type { NextFunction, Request, Response } from "express";
import type { IHandleStripeWebhookUseCase } from "../../application/interfaces/usecase/handle-stripe-webhook.js";
import logger from "../../utils/logger.js";

export class StripeWebhookController {
  constructor(
    private _handleStripeWebhookUseCase: IHandleStripeWebhookUseCase
  ) {}

  webhookHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug("Stripe Webhook API hit 🚀");
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      res.status(400).send("Missing or invalid Stripe signature");
      return;
    }
    try {
      await this._handleStripeWebhookUseCase.execute(req.body, signature);
      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  };
}
