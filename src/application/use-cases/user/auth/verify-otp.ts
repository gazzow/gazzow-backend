import type {
  IVerifyOtpRequestDTO,
} from "../../../dtos/user/user.js";
import type { IVerifyOtpUseCase } from "../../../interfaces/user/auth/verify-otp.js";
import type { IAuthService } from "../../../providers/auth-service.js";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(private _authService: IAuthService) {}

  async execute(data: IVerifyOtpRequestDTO): Promise<void> {
    await this._authService.verifyOtp(data.email, data.otp, "reset");
  }
}
