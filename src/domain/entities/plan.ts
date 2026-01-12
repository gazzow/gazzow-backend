import type { PlanDuration, PlanType } from "../enums/plan.js";

export interface PlanFeature {
  commissionRate: number;
}

export interface IPlan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  features: PlanFeature;
  duration: PlanDuration;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
