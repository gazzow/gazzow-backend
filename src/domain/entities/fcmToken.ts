import type { FCM_DEVICES } from "../enums/FCMToken.js";

export interface IFCMToken {
  id: string;
  userId: string;
  token: string;
  device: FCM_DEVICES;
  isActive: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
