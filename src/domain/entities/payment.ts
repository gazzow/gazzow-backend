export enum PaymentType {
  SUBSCRIPTION = "SUBSCRIPTION",
  TASK_PAYMENT = "TASK_PAYMENT",
  PLATFORM_FEE = "PLATFORM_FEE",
  PAYOUT = "PAYOUT",
  REFUND = "REFUND",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  id: string;
  userId: string; // who paid or received
  taskId?: string;
  subscriptionId?: string;
  relatedUserId?: string; // Connected acc user id
  stripePaymentIntentId?: string;
  stripeTransferId?: string; // Connected account transfer Id
  amount: number; // gross
  platformFee?: number; // Gazzow cut
  netAmount?: number; // user received
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: Date;
}
