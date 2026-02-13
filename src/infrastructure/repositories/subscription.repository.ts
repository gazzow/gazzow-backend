import type { Model } from "mongoose";
import { BaseRepository } from "./base/base-repository.js";
import type { ISubscriptionRepository } from "../../application/interfaces/repository/subscription.repository.js";
import type { ISubscriptionDocument } from "../db/models/subscription.js";
import type { ISubscriptionDistribution } from "../../application/dtos/admin/dashboard.js";

export class SubscriptionRepository
  extends BaseRepository<ISubscriptionDocument>
  implements ISubscriptionRepository
{
  constructor(model: Model<ISubscriptionDocument>) {
    super(model);
  }
  findByUserId(userId: string): Promise<ISubscriptionDocument | null> {
    return this.model.findOne({ userId });
  }

  async getPlanDistribution(): Promise<ISubscriptionDistribution[]> {
    return await this.model.aggregate([
      {
        $group: {
          _id: "$activePlan.type",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },
    ]);
  }
}
