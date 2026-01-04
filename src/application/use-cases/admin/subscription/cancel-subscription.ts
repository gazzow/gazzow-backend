import { SubscriptionStatus } from "../../../../domain/enums/subscription.js";
import type { ISubscriptionRepository } from "../../../interfaces/repository/subscription.repository.js";

export interface ICancelSubscriptionRequestDTO {
  subscriptionId: string;
}

export interface ICancelSubscriptionUseCase {
  execute(dto: ICancelSubscriptionRequestDTO): Promise<void>;
}

export class CancelSubscriptionUseCase implements ICancelSubscriptionUseCase {
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}
  async execute(dto: ICancelSubscriptionRequestDTO): Promise<void> {
    await this._subscriptionRepository.update(dto.subscriptionId, {
      status: SubscriptionStatus.CANCELED,
    });
  }
}
