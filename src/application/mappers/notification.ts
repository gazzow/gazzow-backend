import { Types } from "mongoose";
import type { INotificationDocument } from "../../infrastructure/db/models/notification.model.js";
import type {
  INotification,
  NotificationData,
} from "../../domain/entities/notification.js";
import type { CreateNotificationDTO } from "../dtos/notification.js";

export interface INotificationMapper {
  toPersistentModel(dto: CreateNotificationDTO): Partial<INotificationDocument>;
  toResponseNotificationDTO(doc: INotificationDocument): INotification;
}

export class NotificationMapper implements INotificationMapper {
  toPersistentModel(
    dto: CreateNotificationDTO,
  ): Partial<INotificationDocument> {
    return {
      userId: new Types.ObjectId(dto.userId),
      title: dto.title,
      body: dto.body,
      type: dto.type,
      isRead: false,
      isPushed: false,
    };
  }

  toResponseNotificationDTO(doc: INotificationDocument): INotification {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      body: doc.body,
      type: doc.type,
      data: doc.data as NotificationData,
      isRead: doc.isRead,
      isPushed: doc.isPushed,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
