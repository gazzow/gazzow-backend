import type { ILoginResponseDTO, IUserPublicDTO } from "../../../dtos/user/user.js";

export interface IGoogleCallbackUseCase {
  execute(user: IUserPublicDTO): Promise<ILoginResponseDTO>;
}
