import type { Model } from "mongoose";
import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { IUpdateProfileRequestDTO } from "../../domain/dtos/user.js";
import type { ICreateUserInput } from "../../domain/entities/user.js";
import type { UserStatus } from "../../domain/enums/user-role.js";
import type { IUserDocument } from "../db/models/user-model.js";
import { BaseRepository } from "./base/base-repository.js";

export class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor(userModel: Model<IUserDocument>) {
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
  ): Promise<IUserDocument> {
    const updatedUserDoc = await this.model
      .findByIdAndUpdate(userId, { $set: profileData }, { new: true })
      .lean();

    if (!updatedUserDoc) {
      throw new Error("User not found");
    }

    return updatedUserDoc;
  }

  async findAll(query: {
    filter?: Record<string, string>;
    skip?: number;
    limit?: number;
  }): Promise<IUserDocument[]> {
    const { filter = {}, skip = 0, limit = 8 } = query;
    return await this.model.find(filter).skip(skip).limit(limit);
  }

  count(filter: Record<string, string> = {}): Promise<number> {
    return this.model.countDocuments(filter).lean().exec();
  }

  async updateStatus(
    id: string,
    status: UserStatus
  ): Promise<IUserDocument | null> {
    const updatedUserDoc = await this.model
      .findByIdAndUpdate(id, { status }, { new: true })
      .lean();

    if (!updatedUserDoc) {
      throw new Error("User not found");
    }

    return updatedUserDoc;
  }
}
