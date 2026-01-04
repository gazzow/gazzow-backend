import type { IDashboardMonthlyRevenueResponseDTO } from "../../../dtos/admin/dashboard.js";
import type { ITaskRepository } from "../../../interfaces/repository/task-repository.js";

export interface IDashboardMonthlyRevenueUseCase {
  execute(): Promise<IDashboardMonthlyRevenueResponseDTO>;
}

export class DashboardMonthlyRevenueUseCase
  implements IDashboardMonthlyRevenueUseCase
{
  constructor(private _taskRepository: ITaskRepository) {}

  async execute(): Promise<IDashboardMonthlyRevenueResponseDTO> {
    const data = await this._taskRepository.getMonthlyPlatformRevenue();

    return { data };
  }
}
