import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { IUserMapper } from "../../application/mappers/user.js";
import { type IUsersMapper } from "../../application/mappers/users.js";
import type {
  IUpdateProfileRequestDTO,
  IUserPublicDTO,
} from "../../domain/dtos/user.js";
import type { ICreateUserInput } from "../../domain/entities/user.js";
import type { UserStatus } from "../../domain/enums/user-role.js";
import { UserModel, type IUserDocument } from "../db/models/user-model.js";

export class UserRepository implements IUserRepository {
  constructor(
    private userMapper: IUserMapper,
    private usersMapper: IUsersMapper
  ) {}

  async create(user: ICreateUserInput): Promise<IUserDocument> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findById(id: string): Promise<IUserPublicDTO | null> {
    const userDoc = await UserModel.findById(id);
    
    return userDoc ?  this.userMapper.toPublicDTO(userDoc) : userDoc;
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    const userDoc = await UserModel.findOne({
      email,
    }).lean();
    return userDoc;
  }

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<void | null> {
    return await UserModel.findOneAndUpdate(
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
    const updatedUserDoc = await UserModel.findByIdAndUpdate(
      userId,
      { $set: profileData },
      { new: true }
    ).lean();

    if (!updatedUserDoc) {
      throw new Error("User not found");
    }

    const updatedUser = this.userMapper.toPublicDTO(updatedUserDoc);

    return updatedUser;
  }

  async findAll(): Promise<IUserPublicDTO[]> {
    const usersDoc = await UserModel.find();
    return this.usersMapper.toPublicUsersDTO(usersDoc);
  }

  async updateStatus(
    id: string,
    status: UserStatus
  ): Promise<IUserPublicDTO | null> {
    const updatedUserDoc = await UserModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if(!updatedUserDoc){
      throw new Error("User not found")
    }

    const updatedUser = this.userMapper.toPublicDTO(updatedUserDoc);

    return updatedUser;
  }
}
