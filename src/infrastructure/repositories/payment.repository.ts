import { Types, type Model } from "mongoose";
import type { IBaseRepository } from "../../application/interfaces/repository/base-repository.js";
import type { IPaymentDocument } from "../db/models/payment.model.js";
import { BaseRepository } from "./base/base-repository.js";
import { PaymentStatus, PaymentType } from "../../domain/entities/payment.js";
import type { IMonthlyRevenue } from "../../application/dtos/admin/dashboard.js";

export interface IPaymentRepository extends IBaseRepository<IPaymentDocument> {
  findByStripeIntent(intentId: string): Promise<IPaymentDocument | null>;
  findByUser(userId: string): Promise<IPaymentDocument[]>;
  getPlatformRevenue(): Promise<number>;
  updateByTransferId(
    transferId: string,
    update: Partial<IPaymentDocument>
  ): Promise<IPaymentDocument | null>;
  getTotalEarnings(userId: string): Promise<number>;
  getMonthlyUserEarnings(userId: string): Promise<IMonthlyRevenue[]>;
  getMonthlyPlatformRevenue(): Promise<IMonthlyRevenue[]>;
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
      {
        $match: {
          status: PaymentStatus.SUCCESS,
          type: {
            $in: [PaymentType.SUBSCRIPTION, PaymentType.PAYOUT],
          },
        },
      },
      {
        $addFields: {
          platformAmount: {
            $cond: [
              { $eq: ["$type", PaymentType.SUBSCRIPTION] },
              "$totalAmount", // Subscription → full amount to platform
              "$platformFee", // Payout → only fee to platform
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$platformAmount" },
        },
      },
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

  async getTotalEarnings(userId: string): Promise<number> {
    const result = await this.model.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          status: PaymentStatus.SUCCESS,
          type: PaymentType.PAYOUT,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$netAmount" },
        },
      },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getMonthlyUserEarnings(userId: string): Promise<IMonthlyRevenue[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          status: PaymentStatus.SUCCESS,
          type: PaymentType.PAYOUT,
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          total: { $sum: "$netAmount" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          revenue: { $sum: "$total" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return result.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      revenue: item.revenue,
    }));
  }

  async getMonthlyPlatformRevenue(): Promise<IMonthlyRevenue[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          status: PaymentStatus.SUCCESS,
          type: {
            $in: [PaymentType.SUBSCRIPTION, PaymentType.PAYOUT],
          },
        },
      },
      {
        $addFields: {
          platformAmount: {
            $cond: [
              { $eq: ["$type", PaymentType.SUBSCRIPTION] },
              "$totalAmount", // Subscription revenue
              "$platformFee", // Payout fee
            ],
          },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          platformAmount: 1, 
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          revenue: { $sum: "$platformAmount" }, 
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return result.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      revenue: item.revenue,
    }));
  }
}
