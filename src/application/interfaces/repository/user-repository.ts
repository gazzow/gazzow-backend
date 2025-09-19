import type {
  IUpdateProfileRequestDTO,
  IUserPublicDTO,
} from "../../../domain/dtos/user.js";
import type { ICreateUserInput } from "../../../domain/entities/user.js";
import type { UserStatus } from "../../../domain/enums/user-role.js";
import type { IUserDocument } from "../../../infrastructure/db/models/user-model.js";

export interface IUserRepository {
  create(user: ICreateUserInput): Promise<IUserDocument>;
  findById(id: string): Promise<IUserDocument | null>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  updatePassword(email: string, hashedPassword: string): Promise<void | null>;
  updateProfile(
    userId: string,
    profileData: IUpdateProfileRequestDTO
  ): Promise<IUserDocument>;
  findAll(query: {
    filter?: Record<string, string>;
    skip?: number;
    limit?: number;
  }): Promise<IUserDocument[]>;
  updateStatus(id: string, status: UserStatus): Promise<IUserDocument | null>;
  count (filter: Record<string, string >): Promise<number>
}
