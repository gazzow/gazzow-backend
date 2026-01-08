import { UserModel } from "../db/models/user-model.js";

import {
  UserMapper,
  type IUserMapper,
} from "../../application/mappers/user/user.js";

import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

import type { IUpdateUserProfileUseCase } from "../../application/interfaces/usecase/user/profile/update-profile.js";

import type { IGetUserProfileUseCase } from "../../application/interfaces/usecase/user/profile/get-profile.js";
import { GetUserProfileUseCase } from "../../application/use-cases/user/profile/get-profile.js";

import { UserController } from "../../presentation/controllers/user/user-controller.js";
import { UpdateUserProfileUseCase } from "../../application/use-cases/user/profile/update-profile.js";
import { ProjectRepository } from "../repositories/project-repository.js";
import { ProjectModel } from "../db/models/project-model.js";
import { TaskRepository } from "../repositories/task-repository.js";
import { TaskModel } from "../db/models/task-model.js";
import type { IUserDashboardStatsUseCase } from "../../application/interfaces/usecase/dashboard/dashboard-stats.js";
import { UserDashboardStatsUseCase } from "../../application/use-cases/dashboard/dashboard-stats.js";
import {
  PaymentRepository,
  type IPaymentRepository,
} from "../repositories/payment.repository.js";
import { PaymentModel } from "../db/models/payment.model.js";

export class UserDependencyContainer {
  private readonly _userRepository: IUserRepository;
  private readonly _userMapper: IUserMapper;
  private readonly _projectRepository: ProjectRepository;
  private readonly _taskRepository: TaskRepository;
  private readonly _paymentRepository: IPaymentRepository;

  constructor() {
    this._userRepository = new UserRepository(UserModel);
    this._userMapper = new UserMapper();
    this._projectRepository = new ProjectRepository(ProjectModel);
    this._taskRepository = new TaskRepository(TaskModel);
    this._paymentRepository = new PaymentRepository(PaymentModel);
  }

  private createUpdateProfileUseCase(): IUpdateUserProfileUseCase {
    return new UpdateUserProfileUseCase(this._userRepository, this._userMapper);
  }

  private createGetUserProfileUseCase(): IGetUserProfileUseCase {
    return new GetUserProfileUseCase(this._userRepository, this._userMapper);
  }

  private createDashboardStatsUseCase(): IUserDashboardStatsUseCase {
    return new UserDashboardStatsUseCase(
      this._projectRepository,
      this._taskRepository,
      this._paymentRepository
    );
  }

  createUserController(): UserController {
    return new UserController(
      this.createUpdateProfileUseCase(),
      this.createGetUserProfileUseCase(),
      this.createDashboardStatsUseCase()
    );
  }
}
