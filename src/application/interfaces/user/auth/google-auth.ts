import type { IUserPublicDTO } from "../../../../domain/dtos/user.js";
import type { Profile } from "passport-google-oauth20";

export interface IGoogleAuthUseCase {
  execute(profile: Profile): Promise<IUserPublicDTO>;
}
