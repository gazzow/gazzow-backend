import type { Model } from "mongoose";
import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { IUserMapper } from "../../application/mappers/user.js";
import { type IUsersMapper } from "../../application/mappers/users.js";
import type {
  IUpdateProfileRequestDTO,
  IUserPublicDTO,
} from "../../domain/dtos/user.js";
import type { ICreateUserInput } from "../../domain/entities/user.js";
import type { UserStatus } from "../../domain/enums/user-role.js";
import { type IUserDocument } from "../db/models/user-model.js";
import { BaseRepository } from "./base/base-repository.js";

export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor(
    userModel: Model<IUserDocument>,
    private userMapper: IUserMapper,
    private usersMapper: IUsersMapper
  ) {
    super(userModel);
  }

  async create(user: ICreateUserInput): Promise<IUserDocument> {
    return await this.model.create(user);
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return this.model.findById(id);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return this.model.findOne({ email }).exec();
  }

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<void | null> {
    return await this.model.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );
  }

  async updateProfile(
    userId: string,
    profileData: IUpdateProfileRequestDTO
  ): Promise<IUserPublicDTO> {
    const updatedUserDoc = await this.model
      .findByIdAndUpdate(userId, { $set: profileData }, { new: true })
      .lean();

    if (!updatedUserDoc) {
      throw new Error("User not found");
    }

    const updatedUser = this.userMapper.toPublicDTO(updatedUserDoc);

    return updatedUser;
  }

  async findAll(): Promise<IUserDocument[]> {
    return await this.model.find();
  }

  async updateStatus(
    id: string,
    status: UserStatus
  ): Promise<IUserPublicDTO | null> {
    const updatedUserDoc = await this.model.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updatedUserDoc) {
      throw new Error("User not found");
    }

    const updatedUser = this.userMapper.toPublicDTO(updatedUserDoc);

    return updatedUser;
  }
}
