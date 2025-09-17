import type { IGetUserResponseDTO } from "../../../../domain/dtos/admin/admin.js";
import type { IGetUserUseCase } from "../../../interfaces/admin/users-management/get-user.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";



export class GetUserUseCase implements IGetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<IGetUserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      user,
      message: "User data retrieved!",
    };
  }
}
