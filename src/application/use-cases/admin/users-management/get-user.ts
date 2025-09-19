import type { IGetUserResponseDTO } from "../../../../domain/dtos/admin/admin.js";
import type { IGetUserUseCase } from "../../../interfaces/admin/users-management/get-user.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { IUserMapper } from "../../../mappers/user/user.js";

export class GetUserUseCase implements IGetUserUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper
  ) {}

  async execute(id: string): Promise<IGetUserResponseDTO> {
    const userDoc = await this._userRepository.findById(id);
    if (!userDoc) {
      throw new Error("User not found");
    }

    const user = this._userMapper.toPublicDTO(userDoc)

    return {
      success: true,
      user,
      message: "User data retrieved!",
    };
  }
}
