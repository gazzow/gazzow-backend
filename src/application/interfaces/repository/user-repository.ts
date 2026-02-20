import type { IUpdateProfileRequestDTO } from "../../dtos/user/user.js";
import type { ICreateUserInput } from "../../../domain/entities/user.js";
import type { UserStatus } from "../../../domain/enums/user-role.js";
import type { IUserDocument } from "../../../infrastructure/db/models/user-model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface IUserRepository extends IBaseRepository<IUserDocument> {
  create(user: ICreateUserInput): Promise<IUserDocument>;
  findById(id: string): Promise<IUserDocument | null>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByGoogleId(googleId: string): Promise<IUserDocument | null>;
  updatePassword(email: string, hashedPassword: string): Promise<void | null>;
  updateProfile(
    userId: string,
    profileData: IUpdateProfileRequestDTO,
  ): Promise<IUserDocument | null>;
  findAll({
    filter,
    sort,
    skip,
    limit,
  }: {
    skip: number;
    limit: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sort?: any;
  }): Promise<IUserDocument[]>;
  updateStatus(id: string, status: UserStatus): Promise<IUserDocument | null>;
  count(filter: Record<string, string>): Promise<number>;
}
