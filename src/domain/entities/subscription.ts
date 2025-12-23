import type { PlanDuration, PlanType } from "../enums/plan.js";
import type { SubscriptionStatus } from "../enums/subscription.js";
import type { PlanFeature } from "./plan.js";

export interface ISubscription {
  id: string;
  userId: string;
  planId: string;
  activePlan: {
    id: string;
    type: PlanType;
    price: number;
    features: PlanFeature;
    duration: PlanDuration;
    isActive: boolean;
    createdAt: Date;
  };
  status: SubscriptionStatus;
  paymentId: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  canceledAt?: Date;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
