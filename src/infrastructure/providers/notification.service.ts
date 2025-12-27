import type { CreateNotificationDTO } from "../../domain/entities/notification.js";
import type { INotificationRepository } from "../repositories/notification.repository.js";
import type { IPushService } from "./push.service.js";
import type { INotificationMapper } from "../../application/mappers/notification.js";

export interface INotificationService {
  createAndSend(dto: CreateNotificationDTO): Promise<void>;
}

// application/services/notification.service.ts
export class NotificationService implements INotificationService {
  constructor(
    private notificationRepo: INotificationRepository,
    private _notificationMapper: INotificationMapper,
    private pushService: IPushService
  ) {}

  public async createAndSend(dto: CreateNotificationDTO): Promise<void> {
    // Create notification record
    const persistentModel = this._notificationMapper.toPersistentModel(dto);
    const notificationDoc = await this.notificationRepo.create(persistentModel);

    // Send push notification if requested
    const { title, body } = dto;
    const pushSent = await this.pushService.sendToUser(dto.userId, {
      title,
      body,
    });

    // Update notification record
    if (pushSent) {
      const notificationId = notificationDoc._id.toString();
      await this.notificationRepo.update(notificationId, {
        isPushed: true,
      });
    }
  }
}
