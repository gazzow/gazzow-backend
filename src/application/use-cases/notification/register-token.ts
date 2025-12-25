import type { IFCMToken } from "../../../domain/entities/fcmToken.js";
import type { FCM_DEVICES } from "../../../domain/enums/FCMToken.js";
import type { ITokenRepository } from "../../../infrastructure/repositories/token-repository.js";
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
    // 1️⃣ Ensure user has only one token per device
    await this.tokenRepo.findByUserIdAndDevice(dto.userId, dto.deviceType);

    // 2️⃣ Atomically assign token to this user/device
    const tokenDoc = await this.tokenRepo.assignTokenToUserAndDevice(
      dto.fcmToken,
      dto.userId,
      dto.deviceType
    );

    const data = this._notificationMapper.toResponseDTO(tokenDoc);
    return { data };
  }
}
