import type { INotification, NotificationData } from "../../domain/entities/notification.js";
import type { NotificationType } from "../../domain/enums/notification.js";

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: NotificationData;
}

export interface IMarkNotificationAsReadRequestDTO {
  notificationId: string;
}

export interface IMarkNotificationAsReadResponseDTO {
  data: INotification;
}
