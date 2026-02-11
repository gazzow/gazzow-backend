import type { NotificationType } from "../enums/notification.js";

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
