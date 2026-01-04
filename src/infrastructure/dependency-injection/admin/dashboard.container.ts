import type { IProjectRepository } from "../../../application/interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../../application/interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../../application/interfaces/repository/user-repository.js";
import {
  AdminDashboardStatsUseCase,
  type IAdminDashboardStatsUseCase,
} from "../../../application/use-cases/admin/dashboard/dashboard-stats.js";
import { DashboardController } from "../../../presentation/controllers/admin/dashboard.controller.js";
import { PaymentModel } from "../../db/models/payment.model.js";
import { ProjectModel } from "../../db/models/project-model.js";
import { TaskModel } from "../../db/models/task-model.js";
import { UserModel } from "../../db/models/user-model.js";
import {
  PaymentRepository,
  type IPaymentRepository,
} from "../../repositories/payment.repository.js";
import { ProjectRepository } from "../../repositories/project-repository.js";
import { TaskRepository } from "../../repositories/task-repository.js";
import { UserRepository } from "../../repositories/user-repository.js";

export class AdminDashboardDependencyContainer {
  private readonly _userRepository: IUserRepository;
  private readonly _projectRepository: IProjectRepository;
  private readonly _taskRepository: ITaskRepository;
  private readonly _paymentRepository: IPaymentRepository;

  constructor() {
    this._userRepository = new UserRepository(UserModel);
    this._projectRepository = new ProjectRepository(ProjectModel);
    this._taskRepository = new TaskRepository(TaskModel);
    this._paymentRepository = new PaymentRepository(PaymentModel);
  }

  private createDashboardStatsUseCase(): IAdminDashboardStatsUseCase {
    return new AdminDashboardStatsUseCase(
      this._userRepository,
      this._projectRepository,
      this._taskRepository,
      this._paymentRepository
    );
  }

  // Dashboard Controller
  createDashboardController(): DashboardController {
    return new DashboardController(this.createDashboardStatsUseCase());
  }
}
