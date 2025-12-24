import type Stripe from "stripe";

export interface IStripeService {
  getClient(): Stripe;
  constructEvent(params: { payload: Buffer; signature: string }): Stripe.Event;
  // Get feedback on separate service of stripe with account
  createAccount(email: string): Promise<string>;
  generateOnboardingLink(
    accountId: string
  ): Promise<Stripe.Response<Stripe.AccountLink>>;
  transferFunds(contributorAccountId: string, amount: number): Promise<void>;
  checkOnboardingStatus(accountId: string): Promise<boolean>;
  checkAccountCapabilities(accountId: string): Promise<Stripe.Account>;
  taskCheckoutSession(params: {
    taskId: string;
    amountInCents: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<string>;
  subscriptionCheckout(params: {
    userId: string;
    planId: string;
    amountInCents: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<string>;
}
