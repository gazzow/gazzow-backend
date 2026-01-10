import { SubscriptionStatus } from "../../../../domain/enums/subscription.js";
import type { ICancelSubscriptionRequestDTO } from "../../../dtos/admin/subscription.js";
import type { ISubscriptionRepository } from "../../../interfaces/repository/subscription.repository.js";
import type { ICancelSubscriptionUseCase } from "../../../interfaces/usecase/admin/subscription/cancel-subscription.js";

export class CancelSubscriptionUseCase implements ICancelSubscriptionUseCase {
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}
  async execute(dto: ICancelSubscriptionRequestDTO): Promise<void> {
    await this._subscriptionRepository.update(dto.subscriptionId, {
      status: SubscriptionStatus.CANCELED,
    });
  }
}
