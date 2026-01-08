import { TaskStatus } from "../../../../domain/enums/task.js";
import type { IPaymentRepository } from "../../../../infrastructure/repositories/payment.repository.js";
import type { IAdminDashboardStatsResponseDTO } from "../../../dtos/admin/dashboard.js";
import type { IProjectRepository } from "../../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../../interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IAdminDashboardStatsUseCase } from "../../../interfaces/usecase/admin/dashboard/dashboard-stats.js";

export class AdminDashboardStatsUseCase implements IAdminDashboardStatsUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _projectRepository: IProjectRepository,
    private _taskRepository: ITaskRepository,
    private _paymentRepository: IPaymentRepository
  ) {}
  async execute(): Promise<IAdminDashboardStatsResponseDTO> {
    const totalUsers = await this._userRepository.count({});

    const totalProjects = await this._projectRepository.count({});

    const completedTasks = await this._taskRepository.count({
      status: TaskStatus.COMPLETED,
    });

    const totalRevenue = await this._paymentRepository.getPlatformRevenue();

    return {
      totalUsers,
      totalProjects,
      completedTasks,
      totalRevenue,
    };
  }
}
