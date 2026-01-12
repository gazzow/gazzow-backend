import mongoose, { Schema, Document, Types } from "mongoose";
import {
  PaymentStatus,
  PaymentType,
} from "../../../domain/entities/payment.js";

export type IPaymentDocument = Document & {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  taskId?: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  relatedUserId?: Types.ObjectId;
  stripePaymentIntentId?: string;
  stripeTransferId?: string;
  totalAmount: number;
  platformFee?: number;
  netAmount?: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: Date;
};

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
    relatedUserId: { type: Schema.Types.ObjectId, ref: "User" },

    stripePaymentIntentId: { type: String, index: true },
    stripeTransferId: { type: String },

    totalAmount: { type: Number, default: null },
    platformFee: { type: Number, default: null },
    netAmount: { type: Number, default: null },

    currency: { type: String, default: "USD" },

    type: {
      type: String,
      enum: Object.values(PaymentType),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PaymentModel = mongoose.model<IPaymentDocument>(
  "Payment",
  PaymentSchema
);
