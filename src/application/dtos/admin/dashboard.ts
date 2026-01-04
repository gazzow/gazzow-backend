export interface IAdminDashboardStatsResponseDTO {
  totalUsers: number;
  activeProjects: number;
  completedTasks: number;
  totalRevenue: number;
}

export interface IDashboardMonthlyRevenueResponseDTO {
  data: IMonthlyRevenue[];
}

export interface ISubscriptionDistributionResponseDTO {
  data: ISubscriptionDistribution[];
}

// Associated DTO interfaces
export interface IMonthlyRevenue {
  month: number;
  year: number;
  revenue: number;
}

export interface ISubscriptionDistribution {
  plan: string;
  count: number;
}
