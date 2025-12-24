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
