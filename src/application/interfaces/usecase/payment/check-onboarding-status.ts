import type { ICheckOnboardingStatusRequestDTO } from "../../../dtos/payment.js";

export interface ICheckOnboardingStatusUseCase {
  execute(dto: ICheckOnboardingStatusRequestDTO): Promise<boolean>;
}
