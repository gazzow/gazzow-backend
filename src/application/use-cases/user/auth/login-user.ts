import type { ILoginRequestDTO } from "../../../../domain/dtos/user.js";
import { AppError } from "../../../../utils/app-error.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import logger from "../../../../utils/logger.js";
import type { IUserMapper } from "../../../mappers/user.js";
import type { IAuthService } from "../../../providers/auth-service.js";
import type { ITokenPayload } from "../../../interfaces/jwt/jwt-payload.js";

export class LoginUserUC {
  constructor(
    private authService: IAuthService,
    private userMapper: IUserMapper
  ) {}

  async execute(data: ILoginRequestDTO) {
    // Find user by email
    const userDoc = await this.authService.checkUserExists(data.email);
    if (!userDoc) {
      throw new AppError(ResponseMessages.UserNotFound, HttpStatusCode.NOT_FOUND);
    }

    // Compare password
    const isValidPassword = await this.authService.comparePassword(
      data.password,
      userDoc.password
    );

    logger.info(`password compare res: ${isValidPassword}`);

    if (!isValidPassword) {
      throw new Error("Invalid Credentials!");
    }

    const user = this.userMapper.toPublicDTO(userDoc);

    // Generate Tokens
    const payload: ITokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] =
      await this.authService.generateTokens(payload);

    // return user + tokens
    return {
      accessToken,
      refreshToken,
      user,
      message: "Login Successful!",
    };
  }
}
