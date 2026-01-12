import type { IFCMToken } from "../../../domain/entities/fcmToken.js";
import type { FCM_DEVICES } from "../../../domain/enums/FCMToken.js";
import type { ITokenRepository } from "../../../infrastructure/repositories/token-repository.js";
import logger from "../../../utils/logger.js";
import type { INotificationMapper } from "../../mappers/notification.js";

export interface IRegisterTokenRequestDTO {
  userId: string;
  fcmToken: string;
  deviceType: FCM_DEVICES;
}

export interface IRegisterTokenResponseDTO {
  data: IFCMToken;
}

export interface IRegisterTokenUseCase {
  execute(dto: IRegisterTokenRequestDTO): Promise<IRegisterTokenResponseDTO>;
}

export class RegisterTokenUseCase implements IRegisterTokenUseCase {
  constructor(
    private tokenRepo: ITokenRepository,
    private _notificationMapper: INotificationMapper
  ) {}

  async execute(
    dto: IRegisterTokenRequestDTO
  ): Promise<IRegisterTokenResponseDTO> {
    const existing = await this.tokenRepo.findByUserIdAndDevice(
      dto.userId,
      dto.deviceType
    );
    if (existing) {
      logger.info("user device is already existing");
      existing.token = dto.fcmToken;
      existing.lastSeenAt = new Date();
      await existing.save();
    } else {
      const tokenDoc = await this.tokenRepo.assignTokenToUserAndDevice(
        dto.fcmToken,
        dto.userId,
        dto.deviceType
      );
      const data = this._notificationMapper.toResponseDTO(tokenDoc);
      return { data };
    }

    const data = this._notificationMapper.toResponseDTO(existing);
    return { data };
  }
}
