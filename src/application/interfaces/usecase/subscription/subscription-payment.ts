import type {
  ICreateSubscriptionRequestDTO,
  ICreateSubscriptionResponseDTO,
} from "../../../dtos/subscription.js";

export interface ISubscriptionPaymentUseCase {
  execute(
    dto: ICreateSubscriptionRequestDTO
  ): Promise<ICreateSubscriptionResponseDTO>;
}

