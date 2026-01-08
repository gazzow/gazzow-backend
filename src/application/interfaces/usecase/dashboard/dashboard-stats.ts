import type { IMonthlyRevenue } from "../../../dtos/admin/dashboard.js";
import type { ITaskStatistics } from "../../../dtos/task.js";

export interface IUserDashboardStatsUseCase {
  execute(userId: string): Promise<{
    projectsPosted: number;
    pendingJobs: number;
    completedJobs: number;
    totalEarnings: number;
     monthlyEarnings: IMonthlyRevenue[];
       taskStatistics: ITaskStatistics[];
  }>;
}