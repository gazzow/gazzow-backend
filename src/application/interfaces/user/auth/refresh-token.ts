import type { IRefreshAccessTokenResponseDTO } from "../../../../domain/dtos/user.js";

export interface IRefreshAccessTokenUC {
  execute(token: string): Promise<IRefreshAccessTokenResponseDTO>;
}