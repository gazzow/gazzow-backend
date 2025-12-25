import type { Model } from "mongoose";
import type { IBaseRepository } from "../../application/interfaces/repository/base-repository.js";
import type { ITokenDocument } from "../db/models/token-model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { FCM_DEVICES } from "../../domain/enums/FCMToken.js";

export interface ITokenRepository extends IBaseRepository<ITokenDocument> {
  findByUserIdAndDevice(
    userId: string,
    device: FCM_DEVICES
  ): Promise<ITokenDocument | null>;
  getTokensByUserId(userId: string): Promise<ITokenDocument[]>;
  getTokenByUserId(userId: string): Promise<ITokenDocument | null>;
  findByToken(token: string): Promise<ITokenDocument | null>;
  deleteById(id: string): Promise<boolean>;
  deleteByToken(firebaseToken: string): Promise<boolean>;
  assignTokenToUserAndDevice(
    token: string,
    userId: string,
    device: FCM_DEVICES
  ): Promise<ITokenDocument>;

  // getTokensByUserId(userId: string): Promise<NotificationToken[]>;
  // getTokenById(id: string): Promise<NotificationToken | null>;
  // updateTokenStatus(fcmToken: string, isActive: boolean): Promise<boolean>;
}

export class TokenRepository
  extends BaseRepository<ITokenDocument>
  implements ITokenRepository
{
  constructor(model: Model<ITokenDocument>) {
    super(model);
  }

  findByUserIdAndDevice(
    userId: string,
    device: FCM_DEVICES
  ): Promise<ITokenDocument | null> {
    return this.model.findOne({ userId, device });
  }

  getTokensByUserId(userId: string): Promise<ITokenDocument[]> {
    return this.findAll({ filter: { userId } });
  }

  getTokenByUserId(userId: string): Promise<ITokenDocument | null> {
    return this.model.findOne({ userId });
  }

  async deleteByToken(firebaseToken: string): Promise<boolean> {
    const result = await this.model.deleteOne({ token: firebaseToken });

    return result.deletedCount === 1;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ id });

    return result.deletedCount === 1;
  }

  findByToken(token: string): Promise<ITokenDocument | null> {
    return this.model.findOne({ token });
  }

  async assignTokenToUserAndDevice(
    token: string,
    userId: string,
    device: FCM_DEVICES
  ): Promise<ITokenDocument> {
    return this.model.findOneAndUpdate(
      { token }, // find by token
      {
        token,
        userId,
        device,
        lastSeenAt: new Date(),
        isActive: true,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }
}
