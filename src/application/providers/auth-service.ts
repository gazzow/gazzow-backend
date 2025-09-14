import type { IUserDocument } from "../../infrastructure/db/models/user-model.js";
import type { ITokenPayload } from "../interfaces/jwt/jwt-payload.js";

export interface IAuthService {
  checkUserExists(email: string): Promise<IUserDocument | null>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  verifyOtp(email: string, otp: string, purpose: string): Promise<void>;
  generateTokens(payload: ITokenPayload): Promise<[string, string]>;
  updatePassword(userId: string, hashedPassword: string): Promise<void | null>;
}
