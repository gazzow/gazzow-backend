import {
  UserMapper,
  type IUserMapper,
} from "../../../application/mappers/user/user.js";
import {
  UsersMapper,
  type IUsersMapper,
} from "../../../application/mappers/admin/users.js";
import type { ITokenService } from "../../../application/providers/token-service.js";
import { BlockUserUseCase } from "../../../application/use-cases/admin/users-management/block-user.js";
import { GetUserUseCase } from "../../../application/use-cases/admin/users-management/get-user.js";
import { TokenService } from "../../providers/token-service.js";
import { UserRepository } from "../../repositories/user-repository.js";
import { AdminAuthController } from "../../../presentation/controllers/admin/auth-controller.js";
import { UserManagementController } from "../../../presentation/controllers/admin/user-management.js";
import { VerifyAdmin } from "../../../presentation/middleware/admin/is-admin.js";
import type { IBlockUserUseCase } from "../../../application/interfaces/admin/users-management/block-user.js";
import type { IGetUserUseCase } from "../../../application/interfaces/admin/users-management/get-user.js";
import type { IUserRepository } from "../../../application/interfaces/repository/user-repository.js";
import type { IAdminLoginUseCase } from "../../../application/interfaces/admin/auth/login.js";
import { AdminLoginUseCase } from "../../../application/use-cases/admin/auth/login.js";
import type { IListUsersUseCase } from "../../../application/interfaces/admin/users-management/list-users.js";
import { ListUsersUseCase } from "../../../application/use-cases/admin/users-management/list-users.js";
import { UserModel } from "../../db/models/user-model.js";
import { HashService } from "../../providers/hash-service.js";
import type { IHashService } from "../../../application/providers/hash-service.js";
import { AdminMapper } from "../../../application/mappers/admin/admin.js";
import type { IAdminMapper } from "../../../application/mappers/admin/admin.js";

export class AdminDependencyContainer {
  constructor() {}

  createUserRepository(): IUserRepository {
    return new UserRepository(UserModel);
  }

  createUserMapper(): IUserMapper {
    return new UserMapper();
  }

  createUsersMapper(): IUsersMapper {
    return new UsersMapper(this.createUserMapper());
  }

  createAdminMapper(): IAdminMapper {
    return new AdminMapper();
  }

  createTokenService(): ITokenService {
    return new TokenService();
  }

  createHashService(): IHashService {
    return new HashService();
  }

  createLoginUC(): IAdminLoginUseCase {
    return new AdminLoginUseCase(
      this.createTokenService(),
      this.createUserRepository(),
      this.createHashService(),
      this.createAdminMapper()
    );
  }

  createListUsersUC(): IListUsersUseCase {
    return new ListUsersUseCase(
      this.createUserRepository(),
      this.createUsersMapper()
    );
  }

  createBlockUserUC(): IBlockUserUseCase {
    return new BlockUserUseCase(
      this.createUserRepository(),
      this.createUserMapper()
    );
  }

  createGetUserUC(): IGetUserUseCase {
    return new GetUserUseCase(
      this.createUserRepository(),
      this.createUserMapper()
    );
  }

  // Admin auth Controller
  createAuthController() {
    return new AdminAuthController(this.createLoginUC());
  }

  // Admin User Controller
  createUserManagementController() {
    return new UserManagementController(
      this.createListUsersUC(),
      this.createBlockUserUC(),
      this.createGetUserUC()
    );
  }

  // Verify Middleware
  createVerifyAdminMiddleware(): VerifyAdmin {
    return new VerifyAdmin(this.createTokenService());
  }
}
