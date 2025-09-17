import type { ILoginRequestDTO, ILoginResponseDTO } from "../../../../domain/dtos/user.js";

export interface ILoginUserUseCase{
  execute(data: ILoginRequestDTO): Promise<ILoginResponseDTO>
}