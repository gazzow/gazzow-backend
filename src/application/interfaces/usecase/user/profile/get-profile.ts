import type { IGetUserProfileResponseDTO } from "../../../../dtos/user/user.js";

export interface IGetUserProfileUseCase {
  execute(id: string): Promise<IGetUserProfileResponseDTO>;
}