import type { ISubscriptionDistributionResponseDTO } from "../../../../dtos/admin/dashboard.js";

export interface IDashboardSubscriptionDistributionUseCase {
  execute(): Promise<ISubscriptionDistributionResponseDTO>;
}
