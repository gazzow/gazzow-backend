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
    private pushService: IPushService,
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

  //   async createOnly(dto: CreateNotificationDTO): Promise<INotification> {
  //     return await this.notificationRepo.create({
  //       userId: new Types.ObjectId(dto.userId),
  //       title: dto.title,
  //       body: dto.body,
  //       type: dto.type,
  //       data: dto.data,
  //       isRead: false,
  //       isPushed: false,
  //     });
  //   }

  //   async sendOnly(userId: string, payload: PushPayload): Promise<void> {
  //     await this.pushService.sendToUser(userId, payload);
  //   }

  //   async markAsRead(notificationId: string): Promise<void> {
  //     await this.notificationRepo.update(notificationId, {
  //       isRead: true,
  //       readAt: new Date(),
  //     });
  //   }

  //   async getUserNotifications(userId: string): Promise<INotification[]> {
  //     return await this.notificationRepo.findByUserId(userId);
  //   }
}
