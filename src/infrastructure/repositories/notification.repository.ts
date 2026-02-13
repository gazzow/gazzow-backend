import type { Model } from "mongoose";
import { BaseRepository } from "./base/base-repository.js";
import type { INotificationDocument } from "../db/models/notification.model.js";
import type { INotificationRepository } from "../../application/interfaces/repository/notification.repository.js";
import mongoose from "mongoose";

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
  async markAllNotificationsAsRead(userId: string): Promise<number> {
    const result = await this.model.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), isRead: false },
      {
        $set: {
          isRead: true,
        },
      },
    );
    return result.modifiedCount;
  }
}
