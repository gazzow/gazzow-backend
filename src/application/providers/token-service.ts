import type { ITokenPayload } from "../interfaces/jwt/jwt-payload.js";

export interface ITokenService {
  createAccessToken(payload: ITokenPayload): Promise<string>;
  createRefreshToken(payload: ITokenPayload): Promise<string>; // pass one field to create refreshToken
  verifyAccessToken(token: string): Promise<ITokenPayload>;
  verifyRefreshToken(token: string): Promise<ITokenPayload>;
}
