import { UserModel } from "../db/models/user-model.js";

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

import { AdminAuthController } from "../../presentation/controllers/admin/auth-controller.js";

import { UserManagementController } from "../../presentation/controllers/admin/user-management.js";

import { VerifyAdmin } from "../../presentation/middleware/admin/is-admin.js";

export class AdminDependencyContainer {
  private readonly userRepository: IUserRepository;
  private readonly userMapper: IUserMapper;
  private readonly usersMapper: IUsersMapper;
  private readonly adminMapper: IAdminMapper;
  private readonly tokenService: ITokenService;
  private readonly hashService: IHashService;

  constructor() {
    this.userRepository = new UserRepository(UserModel);
    this.userMapper = new UserMapper();
    this.usersMapper = new UsersMapper(this.userMapper);
    this.adminMapper = new AdminMapper();
    this.tokenService = new TokenService();
    this.hashService = new HashService();
  }

  createLoginUseCase(): IAdminLoginUseCase {
    return new AdminLoginUseCase(
      this.tokenService,
      this.userRepository,
      this.hashService,
      this.adminMapper
    );
  }

  createListUsersUseCase(): IListUsersUseCase {
    return new ListUsersUseCase(this.userRepository, this.usersMapper);
  }

  createBlockUserUseCase(): IBlockUserUseCase {
    return new BlockUserUseCase(this.userRepository, this.userMapper);
  }

  createGetUserUseCase(): IGetUserUseCase {
    return new GetUserUseCase(this.userRepository, this.userMapper);
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

  // Verify Middleware
  createVerifyAdminMiddleware(): VerifyAdmin {
    return new VerifyAdmin(this.tokenService);
  }
}
