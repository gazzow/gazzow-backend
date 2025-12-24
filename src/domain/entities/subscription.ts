import type { PlanDuration, PlanType } from "../enums/plan.js";
import type { SubscriptionStatus } from "../enums/subscription.js";
import type { PlanFeature } from "./plan.js";

export interface IActivePlan {
  name: string;
  type: PlanType;
  price: number;
  features: PlanFeature;
  duration: PlanDuration;
}

export interface ISubscription {
  id: string;
  userId: string;
  planId: string; 
  activePlan: IActivePlan;
  status: SubscriptionStatus;
  paymentId?: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  canceledAt?: Date;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
