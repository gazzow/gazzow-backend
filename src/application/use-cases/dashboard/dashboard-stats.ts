import { TaskStatus } from "../../../domain/enums/task.js";
import type { IPaymentRepository } from "../../../infrastructure/repositories/payment.repository.js";
import type { IMonthlyRevenue } from "../../dtos/admin/dashboard.js";
import type { ITaskStatistics } from "../../dtos/task.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUserDashboardStatsUseCase } from "../../interfaces/usecase/dashboard/dashboard-stats.js";

export class UserDashboardStatsUseCase implements IUserDashboardStatsUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _taskRepository: ITaskRepository,
    private _paymentRepository: IPaymentRepository
  ) {}
  async execute(userId: string): Promise<{
    projectsPosted: number;
    pendingJobs: number;
    completedJobs: number;
    totalEarnings: number;
    monthlyEarnings: IMonthlyRevenue[];
    taskStatistics: ITaskStatistics[];
  }> {
    const projectsPosted = await this._projectRepository.count({
      creatorId: userId,
    });

    const pendingJobs = await this._taskRepository.count({
      assigneeId: userId,
      status: TaskStatus.IN_PROGRESS,
    });

    const completedJobs = await this._taskRepository.count({
      assigneeId: userId,
      status: TaskStatus.COMPLETED,
    });

    const totalEarnings =
      await this._paymentRepository.getTotalEarnings(userId);

    const monthlyEarnings =
      await this._paymentRepository.getMonthlyUserEarnings(userId);

    const taskStatistics = await this._taskRepository.getTaskStatusOverview(userId);

    return {
      projectsPosted,
      pendingJobs,
      completedJobs,
      totalEarnings,
      monthlyEarnings,
      taskStatistics,
    };
  }
}
