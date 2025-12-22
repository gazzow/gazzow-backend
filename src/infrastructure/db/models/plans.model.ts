import { Schema, Types, model, Document } from "mongoose";
import { PlanDuration, PlanType } from "../../../domain/enums/plan.js";

export interface PlanFeature {
  commissionRate: number;
}

export type IPlanDocument = Document & {
  _id: Types.ObjectId;
  name: string;
  type: PlanType;
  price: number;
  features: PlanFeature;
  duration: PlanDuration;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const PlanSchema = new Schema<IPlanDocument>(
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

    features: {
      commissionRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },

    duration: {
      type: String,
      enum: Object.values(PlanDuration),
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PlanModel = model<IPlanDocument>("Plan", PlanSchema);
