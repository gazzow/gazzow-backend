import {
  UserMapper,
  type IUserMapper,
} from "../../../application/mappers/user/user.js";
import {
  UsersMapper,
  type IUsersMapper,
} from "../../../application/mappers/admin/users.js";
import { SetupUserProfileUseCase } from "../../../application/use-cases/user/profile/setup-profile.js";
import { UserRepository } from "../../repositories/user-repository.js";
import { UserController } from "../../../presentation/controllers/user/user-controller.js";
import type { IGetUserProfileUseCase } from "../../../application/interfaces/user/profile/get-profile.js";
import type { IUserRepository } from "../../../application/interfaces/repository/user-repository.js";
import type { ISetupUserProfileUseCase } from "../../../application/interfaces/user/profile/setup-profile.js";
import { GetUserProfileUseCase } from "../../../application/use-cases/user/profile/get-profile.js";
import { UserModel } from "../../db/models/user-model.js";

export class UserDependencyContainer {
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

  createUpdateProfileUC(): ISetupUserProfileUseCase {
    return new SetupUserProfileUseCase(
      this.createUserRepository(),
      this.createUserMapper()
    );
  }

  createGetUserProfileUC(): IGetUserProfileUseCase {
    return new GetUserProfileUseCase(
      this.createUserRepository(),
      this.createUserMapper()
    );
  }

  createUserController(): UserController {
    return new UserController(
      this.createUpdateProfileUC(),
      this.createGetUserProfileUC()
    );
  }
}
