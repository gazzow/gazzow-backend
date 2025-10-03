import type {
  ILoginRequestDTO,
  ILoginResponseDTO,
} from "../../../dtos/user/user.js";
import { AppError } from "../../../../utils/app-error.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import type { IUserMapper } from "../../../mappers/user/user.js";
import type { IAuthService } from "../../../providers/auth-service.js";
import type { ITokenPayload } from "../../../interfaces/jwt/jwt-payload.js";
import type { ILoginUserUseCase } from "../../../interfaces/usecase/user/auth/login-user.js";
import { UserStatus } from "../../../../domain/enums/user-role.js";

export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    private _authService: IAuthService,
    private _userMapper: IUserMapper
  ) {}

  async execute(data: ILoginRequestDTO): Promise<ILoginResponseDTO> {
    // Find user by email
    const userDoc = await this._authService.checkUserExists(data.email);
    if (!userDoc) {
      throw new AppError(
        ResponseMessages.LoginFailed,
        HttpStatusCode.BAD_REQUEST
      );
    }

    if(userDoc.status === UserStatus.BLOCKED){
      throw new AppError(ResponseMessages.UserBlocked, HttpStatusCode.FORBIDDEN)
    }

    // Compare password
    const isValidPassword = await this._authService.comparePassword(
      data.password,
      userDoc.password
    );

    if (!isValidPassword) {
      throw new AppError(
        ResponseMessages.LoginFailed,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const user = this._userMapper.toPublicDTO(userDoc);

    // Generate Tokens
    const payload: ITokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] =
      await this._authService.generateTokens(payload);

    return {
      accessToken,
      refreshToken,
      data: user,
    };
  }
}
