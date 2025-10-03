import type { IRefreshAccessTokenResponseDTO } from "../../../../dtos/user/user.js";

export interface IRefreshAccessTokenUseCase {
  execute(token: string): Promise<IRefreshAccessTokenResponseDTO>;
}