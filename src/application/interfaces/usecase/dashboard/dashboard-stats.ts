
export interface IUserDashboardStatsUseCase {
  execute(userId: string): Promise<{
    projectsPosted: number;
    pendingJobs: number;
    completedJobs: number;
    totalEarnings: number;
  }>;
}