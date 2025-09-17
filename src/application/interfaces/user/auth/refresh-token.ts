import type { IRefreshAccessTokenResponseDTO } from "../../../../domain/dtos/user.js";

export interface IRefreshAccessTokenUseCase {
  execute(token: string): Promise<IRefreshAccessTokenResponseDTO>;
}