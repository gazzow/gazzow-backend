import type {
  ISubscriptionCheckoutRequestDTO,
  ISubscriptionCheckoutResponseDTO,
} from "../../../dtos/payment.js";

export interface ISubscriptionCheckoutUseCase {
  execute(
    dto: ISubscriptionCheckoutRequestDTO
  ): Promise<ISubscriptionCheckoutResponseDTO>;
}
