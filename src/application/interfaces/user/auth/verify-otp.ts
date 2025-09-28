import type { IVerifyOtpRequestDTO } from "../../../../domain/dtos/user.js";

export interface IVerifyOtpUseCase{
  execute(data: IVerifyOtpRequestDTO):Promise<void>
}
