import Stripe from "stripe";
import type { IStripeService } from "../../application/providers/stripe-service.js";
import { AppError } from "../../utils/app-error.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { PaymentType } from "../../domain/entities/payment.js";
import type {
  RefundStatus,
  TaskPaymentStatus,
} from "../../domain/enums/task.js";

export class StripeService implements IStripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-11-17.clover",
    });
  }

  public getClient() {
    return this.stripe;
  }

  public constructEvent(params: {
    payload: Buffer;
    signature: string;
  }): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      params.payload,
      params.signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  }

  public async createAccount(email: string): Promise<string> {
    const stripe = this.getClient();
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
    });

    return account.id;
  }

  public async generateOnboardingLink(
    accountId: string,
  ): Promise<Stripe.Response<Stripe.AccountLink>> {
    const stripe = this.getClient();
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: process.env.STRIPE_REFRESH_URL!,
      return_url: process.env.STRIPE_SUCCESS_URL!,
      type: "account_onboarding",
    });

    return accountLink;
  }

  public async transferFunds(
    contributorAccountId: string,
    amount: number,
    meta?: {
      taskId?: string;
      refundStatus?: RefundStatus;
      taskPaymentStatus?: TaskPaymentStatus;
    },
  ): Promise<Stripe.Transfer> {
    const stripe = this.getClient();

    const totalAmountInCents = amount * 100;

    return await stripe.transfers.create({
      amount: totalAmountInCents,
      currency: "usd",
      destination: contributorAccountId,
      metadata: {
        ...(meta?.taskId && { taskId: meta?.taskId }),
        ...(meta?.taskPaymentStatus && {
          taskPaymentStatus: meta?.taskPaymentStatus,
        }),
        ...(meta?.refundStatus && { refundStatus: meta?.refundStatus }),
      },
    });
  }

  async checkOnboardingStatus(accountId: string): Promise<boolean> {
    const acc = await this.stripe.accounts.retrieve(accountId);
    return acc.details_submitted === true;
  }

  async checkAccountCapabilities(accountId: string): Promise<Stripe.Account> {
    const account = await this.stripe.accounts.retrieve(accountId);
    return account;
  }

  public async taskCheckoutSession(params: {
    taskId: string;
    projectId: string;
    amountInCents: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: `Task #${params.taskId}`,
              description: "Payment for task completion",
            },
            unit_amount: params.amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${params.successUrl}?projectId=${params.projectId}&taskId=${params.taskId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl,
      metadata: {
        taskId: params.taskId,
        paymentType: PaymentType.TASK_PAYMENT,
      },
    });

    if (!session.url) {
      throw new AppError(
        ResponseMessages.FailedToCreateCheckoutSession,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return session.url;
  }

  public async subscriptionCheckout(params: {
    userId: string;
    planId: string;
    amountInCents: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<string> {
    const MODE = "payment";
    const PAYMENT_METHOD_TYPE = "card";

    const session = await this.stripe.checkout.sessions.create({
      mode: MODE,
      payment_method_types: [PAYMENT_METHOD_TYPE],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: `Subscription Plan Id #${params.planId}`,
              description: "Payment for subscription plan",
            },
            unit_amount: params.amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${params.successUrl}?planId=${params.planId}&userId:${params.userId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl,
      metadata: {
        userId: params.userId,
        planId: params.planId,
        paymentType: PaymentType.SUBSCRIPTION,
      },
    });

    if (!session.url) {
      throw new AppError(
        ResponseMessages.FailedToCreateCheckoutSession,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return session.url;
  }
}
