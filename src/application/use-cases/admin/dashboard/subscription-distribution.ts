import type { ISubscriptionDistributionResponseDTO } from "../../../dtos/admin/dashboard.js";
import type { ISubscriptionRepository } from "../../../interfaces/repository/subscription.repository.js";
import type { IDashboardSubscriptionDistributionUseCase } from "../../../interfaces/usecase/admin/dashboard/subscription-distribution.js";

export class DashboardSubscriptionDistributionUseCase
  implements IDashboardSubscriptionDistributionUseCase
{
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}

  async execute(): Promise<ISubscriptionDistributionResponseDTO> {
    const data = await this._subscriptionRepository.getPlanDistribution();
    return { data };
  }
}
