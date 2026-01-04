import type { IProjectRepository } from "../../../application/interfaces/repository/project-repository.js";
import type { ISubscriptionRepository } from "../../../application/interfaces/repository/subscription.repository.js";
import type { ITaskRepository } from "../../../application/interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../../application/interfaces/repository/user-repository.js";
import {
  AdminDashboardStatsUseCase,
  type IAdminDashboardStatsUseCase,
} from "../../../application/use-cases/admin/dashboard/dashboard-stats.js";
import {
  DashboardMonthlyRevenueUseCase,
  type IDashboardMonthlyRevenueUseCase,
} from "../../../application/use-cases/admin/dashboard/monthly-revenue.js";
import {
  DashboardSubscriptionDistributionUseCase,
  type IDashboardSubscriptionDistributionUseCase,
} from "../../../application/use-cases/admin/dashboard/subscription-distribution.js";
import { DashboardController } from "../../../presentation/controllers/admin/dashboard.controller.js";
import { PaymentModel } from "../../db/models/payment.model.js";
import { ProjectModel } from "../../db/models/project-model.js";
import { SubscriptionModel } from "../../db/models/subscription.js";
import { TaskModel } from "../../db/models/task-model.js";
import { UserModel } from "../../db/models/user-model.js";
import {
  PaymentRepository,
  type IPaymentRepository,
} from "../../repositories/payment.repository.js";
import { ProjectRepository } from "../../repositories/project-repository.js";
import { SubscriptionRepository } from "../../repositories/subscription.repository.js";
import { TaskRepository } from "../../repositories/task-repository.js";
import { UserRepository } from "../../repositories/user-repository.js";

export class AdminDashboardDependencyContainer {
  private readonly _userRepository: IUserRepository;
  private readonly _projectRepository: IProjectRepository;
  private readonly _taskRepository: ITaskRepository;
  private readonly _paymentRepository: IPaymentRepository;
  private readonly _subscriptionRepository: ISubscriptionRepository;

  constructor() {
    this._userRepository = new UserRepository(UserModel);
    this._projectRepository = new ProjectRepository(ProjectModel);
    this._taskRepository = new TaskRepository(TaskModel);
    this._paymentRepository = new PaymentRepository(PaymentModel);
    this._subscriptionRepository = new SubscriptionRepository(
      SubscriptionModel
    );
  }

  private createDashboardStatsUseCase(): IAdminDashboardStatsUseCase {
    return new AdminDashboardStatsUseCase(
      this._userRepository,
      this._projectRepository,
      this._taskRepository,
      this._paymentRepository
    );
  }

  private createDashboardMonthlyRevenue(): IDashboardMonthlyRevenueUseCase {
    return new DashboardMonthlyRevenueUseCase(this._taskRepository);
  }
  private createSubscriptionDistributionUseCase(): IDashboardSubscriptionDistributionUseCase {
    return new DashboardSubscriptionDistributionUseCase(
      this._subscriptionRepository
    );
  }

  // Dashboard Controller
  createDashboardController(): DashboardController {
    return new DashboardController(
      this.createDashboardStatsUseCase(),
      this.createDashboardMonthlyRevenue(),
      this.createSubscriptionDistributionUseCase()
    );
  }
}
