import type { IDashboardMonthlyRevenueResponseDTO } from "../../../../dtos/admin/dashboard.js";

export interface IDashboardMonthlyRevenueUseCase {
  execute(): Promise<IDashboardMonthlyRevenueResponseDTO>;
}