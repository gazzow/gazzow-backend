import logger from "../../../utils/logger.js";
import type { IMarkAllNotificationAsReadRequestDTO } from "../../dtos/notification.js";
import type { INotificationRepository } from "../../interfaces/repository/notification.repository.js";
import type { IMarkAllNotificationsAsReadUseCase } from "../../interfaces/usecase/notification/mark-all-notifications-as -read.js";

export class MarkAllNotificationsAsReadUseCase
  implements IMarkAllNotificationsAsReadUseCase
{
  constructor(private _notificationRepository: INotificationRepository) {}

  async execute(dto: IMarkAllNotificationAsReadRequestDTO): Promise<void> {
    logger.debug(`user id: ${dto.userId}`);
    await this._notificationRepository.markAllNotificationsAsRead(dto.userId);
  }
}
