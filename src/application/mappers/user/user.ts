import type { IUserPublicDTO } from "../../../domain/dtos/user.js";
import { Provider } from "../../../domain/enums/user-role.js";
import type { IUserDocument } from "../../../infrastructure/db/models/user-model.js";

export interface IUserMapper {
  toPublicDTO(user: IUserDocument): IUserPublicDTO;
}

export class UserMapper implements IUserMapper {
  toPublicDTO(user: IUserDocument): IUserPublicDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      bio: user.bio ?? "",
      techStacks: user.techStacks ?? [],
      learningGoals: user.learningGoals ?? [],
      experience: user.experience ?? "",
      developerRole: user.developerRole ?? "",
      imageUrl: user.imageUrl ?? "",
      googleId: user.googleId ?? "",
      provider: user.provider ?? Provider.LOCAL,
      createdAt: user.createdAt,
    };
  }
}
