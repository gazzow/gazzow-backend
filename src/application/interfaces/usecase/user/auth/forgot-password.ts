
export interface IForgotPasswordUseCase {
  execute(email: string): Promise<{otpExpiresAt: number}>;
}
