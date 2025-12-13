import type {
  IGenerateOnboardingLinkRequestDTO,
  IGenerateOnboardingLinkResponseDTO,
} from "../../../dtos/payment.js";

export interface IGenerateOnboardingLinkUseCase {
  execute(
    dto: IGenerateOnboardingLinkRequestDTO
  ): Promise<IGenerateOnboardingLinkResponseDTO>;
}
