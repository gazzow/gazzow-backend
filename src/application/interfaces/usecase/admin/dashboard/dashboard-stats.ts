import type { IAdminDashboardStatsResponseDTO } from "../../../../dtos/admin/dashboard.js";

export interface IAdminDashboardStatsUseCase {
  execute(): Promise<IAdminDashboardStatsResponseDTO>;
}
