import type Stripe from "stripe";
import type { IStripeService } from "../providers/stripe-service.js";
import logger from "../../utils/logger.js";
import { PaymentType } from "../../domain/types/payment.js";
import type { ITaskPaymentUseCase } from "../interfaces/usecase/payment/task-payment.js";
import type { IHandleStripeWebhookUseCase } from "../interfaces/usecase/handle-stripe-webhook.js";

export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  constructor(
    private _stripeService: IStripeService,
    private _taskPaymentUseCase: ITaskPaymentUseCase
  ) {}

  async execute(payload: Buffer, signature: string): Promise<void> {
    const event = this._stripeService.constructEvent({ payload, signature });

    // Handle different event types
    logger.info(`Received Stripe event: ${event.type}`);
    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutCompleted(event);
        break;
      // Add more event types as needed
      case "checkout.session.async_payment_failed":
        logger.warn("checkout payment failed");
        break;

      default:
        logger.info(`Ignoring event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(event: Stripe.Event): Promise<void> {
    // Implement your logic to handle the completed checkout session
    const session = event.data.object as Stripe.Checkout.Session;
    logger.info(
      `Received Stripe event: ${event.type} for session ID: ${session.id}`
    );

    if (session.metadata?.paymentType === PaymentType.TASK_PAYMENT) {
      const taskId = session.metadata?.taskId;
      if (!taskId) {
        throw new Error("Task ID not found in session metadata");
      }
      await this._taskPaymentUseCase.execute({ taskId });
    }
  }
}
