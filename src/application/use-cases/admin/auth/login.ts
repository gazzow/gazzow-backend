import type {
  IAdminLoginRequestDTO,
  IAdminLoginResponseDTO,
} from "../../../../domain/dtos/admin/admin.js";
import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import type { IAdminLoginUseCase } from "../../../interfaces/admin/auth/login.js";
import type { ITokenPayload } from "../../../interfaces/jwt/jwt-payload.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IHashService } from "../../../providers/hash-service.js";
import type { ITokenService } from "../../../providers/token-service.js";
import type { IAdminMapper } from "../../../mappers/admin/admin.js";
import { UserRole } from "../../../../domain/enums/user-role.js";
import logger from "../../../../utils/logger.js";

export class AdminLoginUseCase implements IAdminLoginUseCase {
  constructor(
    private _tokenService: ITokenService,
    private _userRepository: IUserRepository,
    private _hashService: IHashService,
    private _adminMapper: IAdminMapper
  ) {}

  async execute(data: IAdminLoginRequestDTO): Promise<IAdminLoginResponseDTO> {
    const adminDoc = await this._userRepository.findByEmail(data.email);
    if (!adminDoc) {
      throw new AppError(
        ResponseMessages.AdminNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (adminDoc.role !== UserRole.ADMIN) {
      logger.debug('user try to login admin page')
      throw new AppError(ResponseMessages.Forbidden, HttpStatusCode.FORBIDDEN);
    }

    const isValidPassword = await this._hashService.compare(
      data.password,
      adminDoc.password
    );
    if (!isValidPassword) {
      throw new AppError(
        ResponseMessages.LoginFailed,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const admin = this._adminMapper.toAdminDTO(adminDoc);

    const payload: ITokenPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this._tokenService.createAccessToken(payload),
      this._tokenService.createRefreshToken(payload),
    ]);

    return {
      success: true,
      accessToken,
      refreshToken,
      data: admin,
      message: ResponseMessages.LoginSuccess,
    };
  }
}
