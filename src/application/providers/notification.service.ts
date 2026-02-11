import type { CreateNotificationDTO } from "../../domain/entities/notification.js";

export interface INotificationService {
  createAndSend(dto: CreateNotificationDTO): Promise<void>;
}
