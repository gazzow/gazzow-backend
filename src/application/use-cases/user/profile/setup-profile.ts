import type {
  IUpdateProfileRequestDTO,
  IUpdateProfileResponseDTO,
} from "../../../../domain/dtos/user.js";
import type { IUserRepository } from "../../../interfaces/repository/user-repository.js";
import type { ISetupUserProfileUseCase } from "../../../interfaces/user/profile/setup-profile.js";


export class SetupUserProfileUseCase implements ISetupUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  execute = async (
    userId: string,
    profileData: IUpdateProfileRequestDTO
  ): Promise<IUpdateProfileResponseDTO> => {
    try {
      const updatedUser = await this.userRepository.updateProfile(
        userId,
        profileData
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return {
        success: true,
        user: updatedUser,
        message: "Profile updated successfully",
      };
    } catch (error) {
      console.error("Update profile error:", error);

      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unable to update profile. Please try again.");
    }
  };
}
