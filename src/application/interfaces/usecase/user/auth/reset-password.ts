import type { IResetPasswordRequestDTO } from "../../../../dtos/user/user.js";

export interface IResetPasswordUseCase{
  execute(data:IResetPasswordRequestDTO): Promise<void>;
}