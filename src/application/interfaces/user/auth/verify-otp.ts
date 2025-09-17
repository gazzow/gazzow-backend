import type { IVerifyOtpRequestDTO, IVerifyOtpResponseDTO } from "../../../../domain/dtos/user.js";

export interface IVerifyOtpUseCase{
  execute(data: IVerifyOtpRequestDTO):Promise<IVerifyOtpResponseDTO>
}
