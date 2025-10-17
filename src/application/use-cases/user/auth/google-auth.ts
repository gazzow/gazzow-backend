import type { IGoogleAuthResponseDTO, IUserPublicDTO } from "../../../dtos/user/user.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IGoogleAuthUseCase } from "../../../interfaces/usecase/user/auth/google-auth.js";
import type { IUserMapper } from "../../../mappers/user/user.js";
import { Provider } from "../../../../domain/enums/user-role.js";
import { AppError } from "../../../../utils/app-error.js";
import type { Profile } from "passport-google-oauth20";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper
  ) {}

  async execute(profile: Profile): Promise<IGoogleAuthResponseDTO> {
    let userDoc = await this._userRepository.findByGoogleId(profile.id);
    let isNewUser: boolean = false

    if (!profile.emails?.[0]?.value) {
      throw new AppError("Google profile does not have email");
    }
    if (!profile.photos?.[0]?.value) {
      throw new AppError("Google profile does not have photo");
    }

    if (!userDoc) {
      userDoc = await this._userRepository.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0].value,
        imageUrl: profile.photos?.[0].value,
        provider: Provider.GOOGLE,
      });
      isNewUser = true
    }
    const user = this._userMapper.toPublicDTO(userDoc);
    return {
      data: user,
      isNewUser,
    }
  }
}
