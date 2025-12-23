import { model, Schema, Types, type Document } from "mongoose";
import { PlanDuration, PlanType } from "../../../domain/enums/plan.js";
import type { PlanFeature } from "./plans.model.js";
import { SubscriptionStatus } from "../../../domain/enums/subscription.js";

export interface IActivePlanDocument {
  name: string;
  type: PlanType;
  price: number;
  features: PlanFeature;
  duration: PlanDuration;
}

export type ISubscriptionDocument = Document & {
  _id: string;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  activePlan: IActivePlanDocument;
  status: SubscriptionStatus;
  paymentId?: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  canceledAt?: Date;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const ActivePlanSchema = new Schema<IActivePlanDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(PlanType),
      required: true,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: String,
      enum: Object.values(PlanDuration),
      required: true,
    },
    features: {
      commissionRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
  },
  { _id: false }
);

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    activePlan: {
      type: ActivePlanSchema,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: true,
      default: SubscriptionStatus.ACTIVE,
      index: true,
    },

    paymentId: {
      type: String,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    autoRenew: {
      type: Boolean,
      default: true,
    },

    canceledAt: {
      type: Date,
    },

    expiredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionModel = model<ISubscriptionDocument>(
  "Subscription",
  SubscriptionSchema
);

SubscriptionSchema.index(
  { userId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);
