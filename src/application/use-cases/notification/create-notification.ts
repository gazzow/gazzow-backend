import type { INotificationService } from "../../../infrastructure/providers/notification.service.js";
import type { CreateNotificationDTO } from "../../../domain/entities/notification.js";

export interface ICreateNotificationUseCase {
  execute(dto: CreateNotificationDTO): Promise<void>;
}
export class CreateNotificationUseCase {
  constructor(private _notificationService: INotificationService) {}

  async execute(dto: CreateNotificationDTO): Promise<void> {
    await this._notificationService.createAndSend(dto);
  }
}
