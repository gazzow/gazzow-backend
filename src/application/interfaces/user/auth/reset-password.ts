import type { IResetPasswordRequestDTO, IResetPasswordResponseDTO } from "../../../../domain/dtos/user.js";

export interface IResetPasswordUseCase{
  execute(data:IResetPasswordRequestDTO): Promise<IResetPasswordResponseDTO>;


}