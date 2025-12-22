import Stripe from "stripe";
import type { IStripeService } from "../../application/providers/stripe-service.js";
import { AppError } from "../../utils/app-error.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";

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
      process.env.STRIPE_WEBHOOK_SECRET!
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
    accountId: string
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
    amount: number
  ): Promise<void> {
    const stripe = this.getClient();

    const totalAmountInCents = amount * 100;

    await stripe.transfers.create({
      amount: totalAmountInCents,
      currency: "usd",
      destination: contributorAccountId,
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
      success_url: `${params.successUrl}?taskId=${params.taskId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl,
      metadata: {
        taskId: params.taskId,
        paymentType: "task_payment",
      },
    });

    if (!session.url) {
      throw new AppError(
        ResponseMessages.FailedToCreateCheckoutSession,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return session.url;
  }
}
