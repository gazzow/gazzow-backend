import type { NotificationType } from "../enums/notification.js";

export interface NotificationToken {
  id?: string;
  userId: string;
  fcmToken: string;
  deviceType: "web" | "ios" | "android";
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface SendNotificationRequest {
  userId?: string;
  fcmTokens?: string[];
  notification: NotificationPayload;
  priority?: "high" | "normal";
}

export interface NotificationPayload {
  title: string;
  body: string;
  imageUrl?: string;
  data?: NotificationData;
  url?: string;
}

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: NotificationData | undefined;
  isRead: boolean;
  isPushed: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationData =
  | {
      type: "TASK";
      taskId: string;
      projectId: string;
    }
  | {
      type: "PROJECT";
      projectId: string;
    }
  | {
      type: "MEETING";
      meetingId: string;
      projectId: string;
    }
  | {
      type: "SYSTEM";
      action: "SUBSCRIPTION_EXPIRED" | "PAYMENT_SUCCESS";
    };

export interface PushPayload {
  title: string;
  body: string;
  data?: NotificationData;
}

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: NotificationData;
}
