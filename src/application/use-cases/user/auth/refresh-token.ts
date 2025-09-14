import type { IRefreshAccessTokenResponseDTO } from "../../../../domain/dtos/user.js";
import { AppError } from "../../../../utils/app-error.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import type { ITokenService } from "../../../providers/token-service.js";
import type { ITokenPayload } from "../../../interfaces/jwt/jwt-payload.js";

export interface IRefreshAccessTokenUC {
  execute(token: string): Promise<IRefreshAccessTokenResponseDTO>;
}

export class RefreshAccessTokenUC implements IRefreshAccessTokenUC {
  constructor(private tokenService: ITokenService) {}
  execute = async (token: string): Promise<IRefreshAccessTokenResponseDTO> => {

    const decoded = await this.tokenService.verifyRefreshToken(token);
    if (!decoded || !decoded.email || !decoded.role) {
      throw new AppError(
        ResponseMessages.InvalidRefreshToken,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const payload: ITokenPayload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    const newAccessToken = await this.tokenService.createAccessToken(payload);

    return {
      success: true,
      message: ResponseMessages.AccessTokenRefreshed,
      newAccessToken,
    };
  };
}
