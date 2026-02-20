import type { Model } from "mongoose";
import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { IUpdateProfileRequestDTO } from "../../application/dtos/user/user.js";
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
  findByGoogleId(googleId: string): Promise<IUserDocument | null> {
    return this.model.findOne({ googleId }).exec();
  }

  async updatePassword(
    email: string,
    hashedPassword: string,
  ): Promise<void | null> {
    return await this.model.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      },
    );
  }

  async updateProfile(
    userId: string,
    profileData: IUpdateProfileRequestDTO,
  ): Promise<IUserDocument | null> {
    const updatedUserDoc = await this.model
      .findByIdAndUpdate(userId, { $set: profileData }, { new: true })
      .lean();

    return updatedUserDoc;
  }

  async findAll({
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
  }): Promise<IUserDocument[]> {
    return this.model
      .find(filter)
      .skip(skip || 0)
      .limit(limit || 6)
      .sort(sort)
      .exec();
  }

  count(filter: Record<string, string> = {}): Promise<number> {
    return this.model.countDocuments(filter).lean().exec();
  }

  async updateStatus(
    id: string,
    status: UserStatus,
  ): Promise<IUserDocument | null> {
    const updatedUserDoc = await this.model
      .findByIdAndUpdate(id, { status }, { new: true })
      .lean();
    return updatedUserDoc;
  }
}
