import type { IPlan, PlanFeature } from "../../../domain/entities/plan.js";
import type { PlanDuration, PlanType } from "../../../domain/enums/plan.js";

export interface ICreatePlanRequestDTO {
  name: string;
  type: PlanType;
  price: number;
  duration: PlanDuration;
  features: PlanFeature;
}

export interface ICreatePlanResponseDTO {
  data: IPlan;
}

export interface IListPlanRequestDTO {
  userId: string;
}

export interface IListPlanResponseDTO {
  data: IPlan[];
}

export interface IGetPlanRequestDTO {
  planId: string;
}

export interface IGetPlanResponseDTO {
  data: IPlan;
}
