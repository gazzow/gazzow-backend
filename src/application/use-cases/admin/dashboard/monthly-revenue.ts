import type { IPaymentRepository } from "../../../../infrastructure/repositories/payment.repository.js";
import type { IDashboardMonthlyRevenueResponseDTO } from "../../../dtos/admin/dashboard.js";
import type { IDashboardMonthlyRevenueUseCase } from "../../../interfaces/usecase/admin/dashboard/monthly-revenue.js";


export class DashboardMonthlyRevenueUseCase
  implements IDashboardMonthlyRevenueUseCase
{
  constructor(private _paymentRepository: IPaymentRepository) {}

  async execute(): Promise<IDashboardMonthlyRevenueResponseDTO> {
    const data = await this._paymentRepository.getMonthlyPlatformRevenue();
    return { data };
  }
}
