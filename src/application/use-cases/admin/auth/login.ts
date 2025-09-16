import type { IAdminLoginResponseDTO } from "../../../../domain/dtos/admin/admin.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { UserRole } from "../../../../domain/enums/user-role.js";
import { env } from "../../../../infrastructure/config/env.js";
import { AppError } from "../../../../utils/app-error.js";
import type { IAdminLoginUseCase } from "../../../interfaces/admin/auth/login.js";
import type { ITokenPayload } from "../../../interfaces/jwt/jwt-payload.js";
import type { ITokenService } from "../../../providers/token-service.js";



export class AdminLoginUC implements IAdminLoginUseCase {
  constructor(private tokenService: ITokenService) {}

  execute = async (email: string, password: string) => {
    if (email === env.admin_email && password === env.admin_password) {
      const payload: ITokenPayload = {
        email: email,
        role: UserRole.ADMIN,
      };

      const accessToken = await this.tokenService.createAccessToken(payload);
      const refreshToken = await this.tokenService.createRefreshToken(payload);

      return {
        success: true,
        accessToken,
        refreshToken,
        admin:{
          email, 
          role: UserRole.ADMIN
        },
        message: "login successful",
      };
    } else {
      throw new AppError(ResponseMessages.LoginFailed, HttpStatusCode.BAD_REQUEST);
    }
  };
}
