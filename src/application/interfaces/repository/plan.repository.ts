import type { PlanDuration, PlanType } from "../../../domain/enums/plan.js";
import type { IPlanDocument } from "../../../infrastructure/db/models/plans.model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface IPlanRepository extends IBaseRepository<IPlanDocument> {
  findByPlanTypeAndDuration(type: PlanType, duration: PlanDuration): Promise<IPlanDocument | null>;
}
