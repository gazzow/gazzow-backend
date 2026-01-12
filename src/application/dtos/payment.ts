import type { IPayment } from "../../domain/entities/payment.js";

export interface ICreateTaskCheckoutSessionRequestDTO {
  taskId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface ICreateTaskCheckoutSessionResponseDTO {
  checkoutUrl: string;
}

export interface ICreateConnectedAccountRequestDTO {
  userId: string;
}

export interface IGenerateOnboardingLinkRequestDTO {
  userId: string;
}

export interface IGenerateOnboardingLinkResponseDTO {
  onboardingUrl: string;
}

export interface IReleaseFundsRequestDTO {
  taskId: string;
}

export interface ICheckOnboardingStatusRequestDTO {
  userId: string;
}

export interface ITaskPaymentRequestDTO {
  taskId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
}

// Subscription
export interface ISubscriptionCheckoutRequestDTO {
  userId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface ISubscriptionCheckoutResponseDTO {
  checkoutUrl: string;
}

export interface IListPaymentsRequestDTO {
  userId: string;
}

export interface IListPaymentsResponseDTO {
  data: IPayment[];
}
