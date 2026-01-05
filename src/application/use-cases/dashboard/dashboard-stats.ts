import { TaskStatus } from "../../../domain/enums/task.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUserDashboardStatsUseCase } from "../../interfaces/usecase/dashboard/dashboard-stats.js";


export class UserDashboardStatsUseCase implements IUserDashboardStatsUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _taskRepository: ITaskRepository
  ) {}
  async execute(userId: string): Promise<{
    projectsPosted: number;
    pendingJobs: number;
    completedJobs: number;
    totalEarnings: number;
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

    const totalEarnings = await this._taskRepository.getTotalEarnings(userId);

    return {
      projectsPosted,
      pendingJobs,
      completedJobs,
      totalEarnings,
    };
  }
}
