import type { Model } from "mongoose";
import type { IBaseRepository } from "../../application/interfaces/repository/base-repository.js";
import type { IPaymentDocument } from "../db/models/payment.model.js";
import { BaseRepository } from "./base/base-repository.js";

export interface IPaymentRepository extends IBaseRepository<IPaymentDocument> {
  findByStripeIntent(intentId: string): Promise<IPaymentDocument | null>;
  findByUser(userId: string): Promise<IPaymentDocument[]>;
  getPlatformRevenue(): Promise<number>;
  updateByTransferId(
    transferId: string,
    update: Partial<IPaymentDocument>
  ): Promise<IPaymentDocument | null>;
}

export class PaymentRepository
  extends BaseRepository<IPaymentDocument>
  implements IPaymentRepository
{
  constructor(model: Model<IPaymentDocument>) {
    super(model);
  }

  async findByStripeIntent(intentId: string): Promise<IPaymentDocument | null> {
    return this.model.findOne({ stripePaymentIntentId: intentId }).lean();
  }

  async findByUser(userId: string): Promise<IPaymentDocument[]> {
    return this.model.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async getPlatformRevenue(): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { status: "SUCCESS", platformFee: { $exists: true } } },
      { $group: { _id: null, total: { $sum: "$platformFee" } } },
    ]);

    return result[0]?.total || 0;
  }

  async updateByTransferId(
    transferId: string,
    update: Partial<IPaymentDocument>
  ): Promise<IPaymentDocument | null> {
    return await this.model.findOneAndUpdate(
      { stripeTransferId: transferId },
      update
    );
  }
}
