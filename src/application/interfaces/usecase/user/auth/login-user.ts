import type { ILoginRequestDTO, ILoginResponseDTO } from "../../../../dtos/user/user.js";

export interface ILoginUserUseCase{
  execute(data: ILoginRequestDTO): Promise<ILoginResponseDTO>
}
