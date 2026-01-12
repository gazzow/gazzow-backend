import type { FCM_DEVICES } from "../../../domain/enums/FCMToken.js";
import type { ITokenRepository } from "../../../infrastructure/repositories/token-repository.js";

export interface IDeleteFirebaseTokenRequestDTO {
  userId: string;
  deviceType: FCM_DEVICES;
}

export interface IDeleteFirebaseTokenUseCase {
  execute(dto: IDeleteFirebaseTokenRequestDTO): Promise<void>;
}

export class DeleteFirebaseTokenUseCase implements IDeleteFirebaseTokenUseCase {
  constructor(private tokenRepo: ITokenRepository) {}

  async execute(dto: IDeleteFirebaseTokenRequestDTO): Promise<void> {
    await this.tokenRepo.deleteByUserAndDevice(dto.userId, dto.deviceType);
  }
}
