import type { IResendOtpRequestDTO, IResendOtpResponseDTO } from "../../../../dtos/user/user.js";

export interface IResendOtpUseCase {
  execute(data: IResendOtpRequestDTO): Promise<IResendOtpResponseDTO>;
}
