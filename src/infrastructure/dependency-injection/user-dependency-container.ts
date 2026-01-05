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
import {
  UserDashboardStatsUseCase,
  type IUserDashboardStatsUseCase,
} from "../../application/use-cases/user/dashboard-stats.js";
import { ProjectRepository } from "../repositories/project-repository.js";
import { ProjectModel } from "../db/models/project-model.js";
import { TaskRepository } from "../repositories/task-repository.js";
import { TaskModel } from "../db/models/task-model.js";

export class UserDependencyContainer {
  private readonly _userRepository: IUserRepository;
  private readonly _userMapper: IUserMapper;

  constructor() {
    this._userRepository = new UserRepository(UserModel);
    this._userMapper = new UserMapper();
  }

  private createUpdateProfileUseCase(): IUpdateUserProfileUseCase {
    return new UpdateUserProfileUseCase(this._userRepository, this._userMapper);
  }

  private createGetUserProfileUseCase(): IGetUserProfileUseCase {
    return new GetUserProfileUseCase(this._userRepository, this._userMapper);
  }

  private createDashboardStatsUseCase(): IUserDashboardStatsUseCase {
    return new UserDashboardStatsUseCase(
      new ProjectRepository(ProjectModel),
      new TaskRepository(TaskModel)
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
