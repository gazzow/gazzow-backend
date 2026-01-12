import type {
  IGetSubscriptionRequestDTO,
  IGetSubscriptionResponseDTO,
} from "../../../dtos/subscription.js";

export interface IGetSubscriptionUseCase {
  execute(
    dto: IGetSubscriptionRequestDTO
  ): Promise<IGetSubscriptionResponseDTO>;
}
