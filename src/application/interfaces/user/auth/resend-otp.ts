import type { IResendOtpRequestDTO } from "../../../dtos/user/user.js";

export interface IResendOtpUseCase {
  execute(data: IResendOtpRequestDTO): Promise<void>;
}
