import type { INotificationMapper } from "../../application/mappers/notification.js";
import type { INotificationRepository } from "../../application/interfaces/repository/notification.repository.js";
import type { INotificationService } from "../../application/providers/notification.service.js";
import type { CreateNotificationDTO } from "../../application/dtos/notification.js";

export class NotificationService implements INotificationService {
  constructor(
    private _notificationRepository: INotificationRepository,
    private _notificationMapper: INotificationMapper,
  ) {}

  public async createAndSend(dto: CreateNotificationDTO): Promise<void> {
    // Create notification record
    const persistentModel = this._notificationMapper.toPersistentModel(dto);
    const notificationDoc =
      await this._notificationRepository.create(persistentModel);

    // Send push notification if requested

    // Update notification record
    const notificationId = notificationDoc._id.toString();
    await this._notificationRepository.update(notificationId, {
      isPushed: true,
    });
  }
}
