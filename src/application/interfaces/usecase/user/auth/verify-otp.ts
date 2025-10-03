import type { IVerifyOtpRequestDTO } from "../../../../dtos/user/user.js";

export interface IVerifyOtpUseCase{
  execute(data: IVerifyOtpRequestDTO):Promise<void>
}
