import type { IPlan } from "../../domain/entities/plan.js";
import type {
  IActivePlan,
  ISubscription,
} from "../../domain/entities/subscription.js";
import type { PlanDuration } from "../../domain/enums/plan.js";
import type { SubscriptionStatus } from "../../domain/enums/subscription.js";

export interface ICreateSubscriptionRequestDTO {
  userId: string;
  planId: string;
}

export interface ICreateSubscriptionDTO {
  userId: string;
  planId: string;
  activePlan: IActivePlan;
  status: SubscriptionStatus;
  paymentId?: string;
  startDate: Date;
  endDate: Date;
  autoRenew?: boolean;
  canceledAt?: Date;
  expiredAt?: Date;
}

export interface ICreateSubscriptionResponseDTO {
  data: ISubscription;
}

export interface IListSubscriptionPlansRequestDTO {
  duration: PlanDuration;
}

export interface IListSubscriptionPlansResponseDTO {
  data: IPlan[];
}

export interface IGetSubscriptionRequestDTO {
  userId: string;
}

export interface IGetSubscriptionResponseDTO {
  data: ISubscription | null;
}
