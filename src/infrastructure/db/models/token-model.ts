import mongoose, { Schema, Types, Document } from "mongoose";
import { FCM_DEVICES } from "../../../domain/enums/FCMToken.js";

export type ITokenDocument = Document & {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  device: FCM_DEVICES;
  isActive: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const FCMTokenSchema = new Schema<ITokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    token: { type: String, required: true, unique: true },
    device: { type: String, enum: Object.values(FCM_DEVICES), required: true },
    isActive: { type: Boolean, default: true },
    lastSeenAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// -------------------------------------------
// Model Export
// -------------------------------------------
export const TokenModel = mongoose.model<ITokenDocument>(
  "FCMToken",
  FCMTokenSchema
);


FCMTokenSchema.index({ token: 1 }, { unique: true });
FCMTokenSchema.index({ userId: 1, device: 1 }, { unique: true });

