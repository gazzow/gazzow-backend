import type { INotificationRepository } from "../../interfaces/repository/notification.repository.js";
import type { IGetUnreadNotificationCountUseCase } from "../../interfaces/usecase/notification/get-count.js";

export class GetUnreadNotificationCountUseCase
  implements IGetUnreadNotificationCountUseCase
{
  constructor(private _notificationRepository: INotificationRepository) {}
  async execute(userId: string): Promise<number> {
    const count =
      await this._notificationRepository.getUnreadCountByUserId(userId);
    return count;
  }
}
