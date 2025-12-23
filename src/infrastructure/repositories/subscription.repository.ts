import type { Model } from "mongoose";
import { BaseRepository } from "./base/base-repository.js";
import type { ISubscriptionRepository } from "../../application/interfaces/repository/subscription.repository.js";
import type { ISubscriptionDocument } from "../db/models/subscription.js";

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
}
