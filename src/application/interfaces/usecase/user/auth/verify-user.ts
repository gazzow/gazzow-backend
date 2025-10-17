import type { IVerificationResult } from "../../../../../domain/entities/user.js";

export interface IVerifyUserUseCase {
  execute(email: string, otp: string): Promise<IVerificationResult>;
}
