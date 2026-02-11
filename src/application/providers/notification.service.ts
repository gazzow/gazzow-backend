import type { CreateNotificationDTO } from "../dtos/notification.js";

export interface INotificationService {
  createAndSend(dto: CreateNotificationDTO): Promise<void>;
}
