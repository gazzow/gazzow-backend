import type { IGoogleAuthResponseDTO, IUserPublicDTO } from "../../../dtos/user/user.js";
import type { Profile } from "passport-google-oauth20";

export interface IGoogleAuthUseCase {
  execute(profile: Profile): Promise<IGoogleAuthResponseDTO>;
}
