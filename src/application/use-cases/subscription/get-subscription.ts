import type {
  IGetSubscriptionRequestDTO,
  IGetSubscriptionResponseDTO,
} from "../../dtos/subscription.js";
import type { ISubscriptionRepository } from "../../interfaces/repository/subscription.repository.js";
import type { IGetSubscriptionUseCase } from "../../interfaces/usecase/subscription/get-subscription.js";
import type { ISubscriptionMapper } from "../../mappers/subscription.js";

export class GetSubscriptionUseCase implements IGetSubscriptionUseCase {
  constructor(
    private _subscriptionRepository: ISubscriptionRepository,
    private _subscriptionMapper: ISubscriptionMapper
  ) {}
  async execute(
    dto: IGetSubscriptionRequestDTO
  ): Promise<IGetSubscriptionResponseDTO> {
    const activeSubscription = await this._subscriptionRepository.findByUserId(
      dto.userId
    );

    if (!activeSubscription) {
      return { data: null };
    }

    const data = this._subscriptionMapper.toResponseDTO(activeSubscription);

    return { data };
  }
}
