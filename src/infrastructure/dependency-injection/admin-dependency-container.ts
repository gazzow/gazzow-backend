import { UserModel } from "../db/models/user-model.js";
import { ProjectModel } from "../db/models/project-model.js";

import {
  UserMapper,
  type IUserMapper,
} from "../../application/mappers/user/user.js";

import {
  UsersMapper,
  type IUsersMapper,
} from "../../application/mappers/admin/users.js";

import {
  AdminMapper,
  type IAdminMapper,
} from "../../application/mappers/admin/admin.js";

import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import { ProjectRepository } from "../repositories/project-repository.js";

import type { ITokenService } from "../../application/providers/token-service.js";
import { TokenService } from "../providers/token-service.js";

import type { IHashService } from "../../application/providers/hash-service.js";
import { HashService } from "../providers/hash-service.js";

import type { IAdminLoginUseCase } from "../../application/interfaces/usecase/admin/auth/login.js";
import { AdminLoginUseCase } from "../../application/use-cases/admin/auth/login.js";

import type { IListUsersUseCase } from "../../application/interfaces/usecase/admin/users-management/list-users.js";
import { ListUsersUseCase } from "../../application/use-cases/admin/users-management/list-users.js";

import type { IBlockUserUseCase } from "../../application/interfaces/usecase/admin/users-management/block-user.js";
import { BlockUserUseCase } from "../../application/use-cases/admin/users-management/block-user.js";

import type { IGetUserUseCase } from "../../application/interfaces/usecase/admin/users-management/get-user.js";
import { GetUserUseCase } from "../../application/use-cases/admin/users-management/get-user.js";

import type { IAdminListProjectsUseCase } from "../../application/interfaces/usecase/admin/project/list-projects.js";
import { AdminListProjectsUseCase } from "../../application/use-cases/admin/project/list-projects.js";

import { AdminAuthController } from "../../presentation/controllers/admin/auth-controller.js";

import { UserManagementController } from "../../presentation/controllers/admin/user-management.js";

import { AdminProjectController } from "../../presentation/controllers/admin/project-controller.js";

import { VerifyAdmin } from "../../presentation/middleware/admin/is-admin.js";
import {
  ProjectMapper,
  type IProjectMapper,
} from "../../application/mappers/project.js";

export class AdminDependencyContainer {
  private readonly _userRepository: IUserRepository;
  private readonly _projectRepository: IProjectRepository;
  private readonly _userMapper: IUserMapper;
  private readonly _projectMapper: IProjectMapper;
  private readonly _usersMapper: IUsersMapper;
  private readonly _adminMapper: IAdminMapper;
  private readonly _tokenService: ITokenService;
  private readonly _hashService: IHashService;

  constructor() {
    this._userRepository = new UserRepository(UserModel);
    this._projectRepository = new ProjectRepository(ProjectModel);
    this._userMapper = new UserMapper();
    this._projectMapper = new ProjectMapper();
    this._usersMapper = new UsersMapper(this._userMapper);
    this._adminMapper = new AdminMapper();
    this._tokenService = new TokenService();
    this._hashService = new HashService();
  }

  private createLoginUseCase(): IAdminLoginUseCase {
    return new AdminLoginUseCase(
      this._tokenService,
      this._userRepository,
      this._hashService,
      this._adminMapper
    );
  }

  private createListUsersUseCase(): IListUsersUseCase {
    return new ListUsersUseCase(this._userRepository, this._usersMapper);
  }

  private createBlockUserUseCase(): IBlockUserUseCase {
    return new BlockUserUseCase(this._userRepository, this._userMapper);
  }

  private createGetUserUseCase(): IGetUserUseCase {
    return new GetUserUseCase(this._userRepository, this._userMapper);
  }

  private createListProjectsUseCase(): IAdminListProjectsUseCase {
    return new AdminListProjectsUseCase(
      this._projectRepository,
      this._projectMapper
    );
  }

  // Admin auth Controller
  createAuthController() {
    return new AdminAuthController(this.createLoginUseCase());
  }

  // Admin User Controller
  createUserManagementController() {
    return new UserManagementController(
      this.createListUsersUseCase(),
      this.createBlockUserUseCase(),
      this.createGetUserUseCase()
    );
  }

  // Project Controller
  createProjectController() {
    return new AdminProjectController(this.createListProjectsUseCase());
  }

  // Verify Middleware
  createVerifyAdminMiddleware(): VerifyAdmin {
    return new VerifyAdmin(this._tokenService);
  }
}
