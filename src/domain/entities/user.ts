import type { UserRole, UserStatus } from "../enums/user-role.js";
import type { IBaseUser } from "./base-entity.js";

export interface IUser extends IBaseUser {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  bio?: string;
  developerRole?: string;
  imageUrl?: string;
  experience?: string;
  techStacks?: string[];
  learningGoals?: string[];
}

export interface IUserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  bio?: string;
  developerRole?: string;
  imageUrl?: string;
  experience?: string;
  techStacks?: string[];
  learningGoals?: string[];
  createdAt: Date;
}

export interface IUserWithPassword extends IUser {
  password: string;
}

export interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface IVerificationResult {
  accessToken: string;
  refreshToken: string;
  user: IUserPublic;
  message: string;
}

export interface ITempUserData {
  name: string;
  email: string;
  password: string;
}
