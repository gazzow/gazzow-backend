import type { INotificationDocument } from "../../../infrastructure/db/models/notification.model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface INotificationRepository
  extends IBaseRepository<INotificationDocument> {
  findByUserId(userId: string): Promise<INotificationDocument[]>;
  getUnreadCountByUserId(userId: string): Promise<number>;
}
