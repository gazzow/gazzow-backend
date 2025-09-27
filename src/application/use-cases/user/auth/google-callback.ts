import type { ILoginResponseDTO, IUserPublicDTO } from "../../../../domain/dtos/user.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import type { ITokenPayload } from "../../../interfaces/jwt/jwt-payload.js";
import type { IGoogleCallbackUseCase } from "../../../interfaces/user/auth/google-callback.js";
import type { IAuthService } from "../../../providers/auth-service.js";

export class GoogleCallBackUseCase implements IGoogleCallbackUseCase {
  constructor(private _authService: IAuthService) {}

  async execute(user: IUserPublicDTO): Promise<ILoginResponseDTO> {
    // Generate Tokens
    const payload: ITokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] =
      await this._authService.generateTokens(payload);

    // return user + tokens
    return {
      accessToken,
      refreshToken,
      user,
      success: true,
      message: ResponseMessages.LoginSuccess,
    };
  }
}
