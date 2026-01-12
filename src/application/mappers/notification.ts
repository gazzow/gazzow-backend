import { Types } from "mongoose";
import type { IFCMToken } from "../../domain/entities/fcmToken.js";
import type { ITokenDocument } from "../../infrastructure/db/models/token-model.js";
import type { IRegisterTokenRequestDTO } from "../use-cases/notification/register-token.js";
import type { INotificationDocument } from "../../infrastructure/db/models/notification.model.js";
import type {
  CreateNotificationDTO,
  INotification,
  NotificationData,
} from "../../domain/entities/notification.js";

export interface INotificationMapper {
  toPersistent(dto: IRegisterTokenRequestDTO): Partial<ITokenDocument>;
  toPersistentModel(dto: CreateNotificationDTO): Partial<INotificationDocument>;
  toResponseDTO(doc: ITokenDocument): IFCMToken;
  toResponseNotificationDTO(doc: INotificationDocument): INotification;
}

export class NotificationMapper implements INotificationMapper {
  toPersistentModel(
    dto: CreateNotificationDTO
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

  toPersistent(dto: IRegisterTokenRequestDTO): Partial<ITokenDocument> {
    return {
      userId: new Types.ObjectId(dto.userId),
      token: dto.fcmToken,
      device: dto.deviceType,
    };
  }

  toResponseDTO(doc: ITokenDocument): IFCMToken {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      token: doc.token,
      device: doc.device,
      isActive: doc.isActive,
      lastSeenAt: doc.lastSeenAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
