import type { ISubscriptionDistributionResponseDTO } from "../../../dtos/admin/dashboard.js";
import type { ISubscriptionRepository } from "../../../interfaces/repository/subscription.repository.js";

export interface IDashboardSubscriptionDistributionUseCase {
  execute(): Promise<ISubscriptionDistributionResponseDTO>;
}

export class DashboardSubscriptionDistributionUseCase
  implements IDashboardSubscriptionDistributionUseCase
{
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}

  async execute(): Promise<ISubscriptionDistributionResponseDTO> {
    const data = await this._subscriptionRepository.getPlanDistribution();
    return { data };
  }
}
