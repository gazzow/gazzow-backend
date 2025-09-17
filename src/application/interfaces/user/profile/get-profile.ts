import type { IGetUserProfileResponseDTO } from "../../../../domain/dtos/user.js";

export interface IGetUserProfileUseCase {
  execute(id: string): Promise<IGetUserProfileResponseDTO>;
}