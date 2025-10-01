import type { ILoginResponseDTO } from "../../../dtos/user/user.js";
import type { IUser } from "../../../../domain/entities/user.js";

export interface IGoogleCallbackUseCase {
  execute(user: IUser): Promise<Omit<ILoginResponseDTO, "user">>;
}
