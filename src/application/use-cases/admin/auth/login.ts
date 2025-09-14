import type { IAdminLoginResponseDTO } from "../../../../domain/dtos/admin/admin.js";
import { UserRole } from "../../../../domain/enums/user-role.js";
import { env } from "../../../../infrastructure/config/env.js";
import type { ITokenPayload } from "../../../interfaces/jwt/jwt-payload.js";
import type { ITokenService } from "../../../providers/token-service.js";

export interface IAdminLoginUC {
  execute(email: string, password: string): Promise<IAdminLoginResponseDTO>;
}

export class AdminLoginUC {
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
        message: "login successful",
      };
    } else {
      throw new Error("Invalid Admin Credentials. Please try again!");
    }
  };
}
