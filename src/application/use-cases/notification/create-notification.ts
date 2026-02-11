import type { CreateNotificationDTO } from "../../dtos/notification.js";
import type { INotificationService } from "../../providers/notification.service.js";

export interface ICreateNotificationUseCase {
  execute(dto: CreateNotificationDTO): Promise<void>;
}
export class CreateNotificationUseCase {
  constructor(private _notificationService: INotificationService) {}

  async execute(dto: CreateNotificationDTO): Promise<void> {
    await this._notificationService.createAndSend(dto);
  }
}
