import type { ISubscriptionDocument } from "../../../infrastructure/db/models/subscription.js";
import type { ISubscriptionDistribution } from "../../dtos/admin/dashboard.js";
import type { IBaseRepository } from "./base-repository.js";

export interface ISubscriptionRepository extends IBaseRepository<ISubscriptionDocument> {
  findByUserId(
   userId: string
  ): Promise<ISubscriptionDocument | null>;
  getPlanDistribution(): Promise<
   ISubscriptionDistribution[]
  >;
}
