import type { IForgotPasswordResponseDTO } from "../../../../domain/dtos/user.js";

export interface IForgotPasswordUseCase {
  execute(email: string): Promise<IForgotPasswordResponseDTO>;
}
