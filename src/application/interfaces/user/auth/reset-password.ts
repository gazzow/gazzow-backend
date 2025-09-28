import type { IResetPasswordRequestDTO } from "../../../../domain/dtos/user.js";

export interface IResetPasswordUseCase{
  execute(data:IResetPasswordRequestDTO): Promise<void>;


}