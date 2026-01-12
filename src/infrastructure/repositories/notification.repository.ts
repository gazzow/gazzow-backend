import type { Model } from "mongoose";
import type { IBaseRepository } from "../../application/interfaces/repository/base-repository.js";
import { BaseRepository } from "./base/base-repository.js";
import type { INotificationDocument } from "../db/models/notification.model.js";

export interface INotificationRepository
  extends IBaseRepository<INotificationDocument> {
  findByUserId(userId: string): Promise<INotificationDocument[]>;
  getUnreadCountByUserId(userId: string): Promise<number>;
}

export class NotificationRepository
  extends BaseRepository<INotificationDocument>
  implements INotificationRepository
{
  constructor(model: Model<INotificationDocument>) {
    super(model);
  }
  findByUserId(userId: string): Promise<INotificationDocument[]> {
    return this.findAll({ filter: { userId } });
  }
  getUnreadCountByUserId(userId: string): Promise<number> {
    return this.model
      .countDocuments({ userId, isRead: false, readAt: null })
      .exec();
  }
}
