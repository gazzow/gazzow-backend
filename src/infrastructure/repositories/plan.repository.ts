import type { Model } from "mongoose";
import type { IPlanRepository } from "../../application/interfaces/repository/plan.repository.js";
import type { PlanDuration, PlanType } from "../../domain/enums/plan.js";
import type { IPlanDocument } from "../db/models/plans.model.js";
import { BaseRepository } from "./base/base-repository.js";

export class PlanRepository
  extends BaseRepository<IPlanDocument>
  implements IPlanRepository
{
  constructor(model: Model<IPlanDocument>) {
    super(model);
  }
  findByPlanTypeAndDuration(
    type: PlanType,
    duration: PlanDuration
  ): Promise<IPlanDocument | null> {
    return this.model.findOne({ type, duration });
  }
}
