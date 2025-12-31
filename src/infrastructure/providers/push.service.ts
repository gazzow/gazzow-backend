import type { INotificationMapper } from "../../application/mappers/notification.js";
import type { PushPayload } from "../../domain/entities/notification.js";
import logger from "../../utils/logger.js";
import { messaging } from "../config/firebase.config.js";
import type { ITokenRepository } from "../repositories/token-repository.js";

export interface IPushService {
  sendToUser(userId: string, payload: PushPayload): Promise<boolean>;
  // sendToMultipleUsers(userIds: string[], payload: PushPayload): Promise<void>;
  // sendToTopic(topic: string, payload: PushPayload): Promise<void>;
}

export class PushService implements IPushService {
  constructor(
    private tokenRepo: ITokenRepository,
    private _notificationMapper: INotificationMapper
  ) {}

  async sendToUser(userId: string, payload: PushPayload): Promise<boolean> {
    logger.warn(`push service working for User : ${userId}`);
    const tokenDoc = await this.tokenRepo.getTokenByUserId(userId);

    if (!tokenDoc) {
      logger.warn(`No FCM token found for user ${userId}`);
      return false;
    }

    const tokenEntity = this._notificationMapper.toResponseDTO(tokenDoc);
    const { token } = tokenEntity;
    logger.warn(`message send to user: ${JSON.stringify(tokenEntity)}`);
    try {
      const response = await messaging.send({
        // 👇 ADD THIS - Sends notification object for background handling
        notification: {
          title: payload.title,
          body: payload.body,
        },
        // 👇 KEEP THIS - Sends data for foreground handling
        data: {
          title: payload.title,
          body: payload.body,
          ...payload.data,
        },
        token,
      });

      logger.info(`Push sent successfully: ${response}`);

      // Handle invalid token using try/catch
    } catch (error: any) {
      if (error.code === "messaging/registration-token-not-registered") {
        logger.warn(`Dead FCM token removed: ${token}`);
        // set isActive=false
      } else {
        logger.error("Push error:", error);
      }
      return false;
    }

    return true;
  }

  // async sendToMultipleUsers(
  //   userIds: string[],
  //   payload: PushPayload
  // ): Promise<void> {
  //   const tokens = await this.tokenRepo.getTokensByUserIds(userIds);

  //   if (tokens.length === 0) return;

  //   const response = await messaging.sendEachForMulticast({
  //     tokens: tokens.map((t) => t.token),
  //     notification: {
  //       title: payload.title,
  //       body: payload.body,
  //     },
  //     data: payload.data || {},
  //   });

  //   logger.info(
  //     `Multicast sent: ${response.successCount} successful, ${response.failureCount} failed`
  //   );
  // }

  // async sendToTopic(topic: string, payload: PushPayload): Promise<void> {
  //   await messaging.send({
  //     topic,
  //     notification: {
  //       title: payload.title,
  //       body: payload.body,
  //     },
  //     data: payload.data || {},
  //   });
  // }
}
