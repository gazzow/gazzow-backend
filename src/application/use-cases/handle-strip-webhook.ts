import type Stripe from "stripe";
import type { IStripeService } from "../providers/stripe-service.js";
import logger from "../../utils/logger.js";
import type { ITaskPaymentUseCase } from "../interfaces/usecase/payment/task-payment.js";
import type { IHandleStripeWebhookUseCase } from "../interfaces/usecase/handle-stripe-webhook.js";
import type { ISubscriptionPaymentUseCase } from "../interfaces/usecase/subscription/subscription-payment.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import type { ITaskRepository } from "../interfaces/repository/task-repository.js";
import type { IPaymentRepository } from "../../infrastructure/repositories/payment.repository.js";
import { AppError } from "../../utils/app-error.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { RefundStatus, TaskPaymentStatus } from "../../domain/enums/task.js";
import { PaymentStatus, PaymentType } from "../../domain/entities/payment.js";

export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  constructor(
    private _stripeService: IStripeService,
    private _taskPaymentUseCase: ITaskPaymentUseCase,
    private _subscriptionPaymentUseCase: ISubscriptionPaymentUseCase,
    private _taskRepository: ITaskRepository,
    private _paymentRepository: IPaymentRepository
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
      case "transfer.created":
        await this.handleTransferCreated(event);
        break;
      default:
        logger.info(`Ignoring event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    logger.info(`Stripe checkout completed: ${session.id}`);
    const paymentIntentId = session.payment_intent as string;
    const amount = (session.amount_total || 0) / 100;
    const currency = session.currency?.toUpperCase() || "USD";

    if (session.metadata?.paymentType === PaymentType.TASK_PAYMENT) {
      const taskId = session.metadata?.taskId;
      if (!taskId) {
        throw new Error("Task Id not found in session metadata");
      }

      await this._taskPaymentUseCase.execute({
        taskId,
        stripePaymentIntentId: paymentIntentId,
        amount,
        currency,
      });
    } else if (session.metadata?.paymentType === PaymentType.SUBSCRIPTION) {
      const planId = session.metadata?.planId;
      const userId = session.metadata?.userId;
      if (!planId) {
        throw new Error("Plan Id not found in session metadata");
      }

      if (!userId) throw new Error(ResponseMessages.UserNotFound);

      await this._subscriptionPaymentUseCase.execute({
        planId,
        userId,
        stripePaymentIntentId: paymentIntentId,
        amount,
        currency,
      });
    }
  }

  private async handleTransferCreated(event: Stripe.Event): Promise<void> {
    const transfer = event.data.object as Stripe.Transfer;

    const taskId = transfer.metadata?.taskId;
    const transferId = transfer.id;

    if (!taskId)
      throw new AppError(
        ResponseMessages.TaskIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );

    logger.info(`Stripe transfer created: ${JSON.stringify(transfer)}`);

    await this._paymentRepository.updateByTransferId(transferId, {
      status: PaymentStatus.SUCCESS,
    });

    if (transfer.metadata.refundStatus === RefundStatus.RELEASED) {
      logger.debug("Updating task doc after successful refund transfer");

      await this._taskRepository.update(taskId, {
        refundAmount: 0,
        refundStatus: RefundStatus.SUCCESS,
      });
    } else if (
      transfer.metadata.taskPaymentStatus === TaskPaymentStatus.RELEASED
    ) {
      logger.debug("Updating task doc after successful payout transfer");
      await this._taskRepository.update(taskId, {
        paymentStatus: TaskPaymentStatus.PAID,
        paidAt: new Date(),
        amountInEscrow: 0,
      });
    }
  }
}
