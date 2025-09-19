import type { IVerifyOtpRequestDTO, IVerifyOtpResponseDTO } from "../../../../domain/dtos/user.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import type { AuthService } from "../../../../infrastructure/providers/auth-service.js";
import type { IVerifyOtpUseCase } from "../../../interfaces/user/auth/verify-otp.js";


export class VerifyOtpUseCase implements IVerifyOtpUseCase{
  constructor(private _authService: AuthService) {}

  async execute(data: IVerifyOtpRequestDTO): Promise<IVerifyOtpResponseDTO> {
    try {

        await this._authService.verifyOtp(data.email, data.otp, 'reset')

        return {
            success: true,
            message: ResponseMessages.OtpVerified,
        }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}
