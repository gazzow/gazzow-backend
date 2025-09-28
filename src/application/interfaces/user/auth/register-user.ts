import type { ITempUserData } from "../../../../domain/entities/user.js";

export interface IRegisterUserUseCase {
  execute(
    userData: ITempUserData
  ): Promise<void>;
}
