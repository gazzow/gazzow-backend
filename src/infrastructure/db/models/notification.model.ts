import { Schema, model, Types, Document } from "mongoose";
import { NotificationType } from "../../../domain/enums/notification.js";
import type { NotificationData } from "../../../domain/entities/notification.js";

export type INotificationDocument = Document & {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  data?: NotificationData;
  isRead: boolean;
  isPushed: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: { type: String, required: true },
    body: { type: Schema.Types.Mixed },
    data: {
      url: String,
      taskId: Types.ObjectId,
      projectId: Types.ObjectId,
    },
    isRead: { type: Boolean, default: false },
    isPushed: { type: Boolean, default: false },
    readAt: { Type: Date },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel = model<INotificationDocument>(
  "Notification",
  notificationSchema
);
