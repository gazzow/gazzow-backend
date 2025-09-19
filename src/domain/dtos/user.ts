import type { IUserDocument } from "../../infrastructure/db/models/user-model.js";
import type { UserRole, UserStatus } from "../enums/user-role.js";

export interface IUserPublicDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  bio?: string;
  techStacks?: string[];
  learningGoals?: string[];
  experience?: string;
  developerRole?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface ILoginRequestDTO {
  email: string;
  password: string;
}

export interface ILoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  success: boolean;
  user: IUserPublicDTO;
  message: string;
}

export interface IForgotPasswordRequestDTO {
  email: string;
}

export interface IForgotPasswordResponseDTO {
  success: boolean;
  message: string;
}
export interface IVerifyOtpRequestDTO {
  email: string;
  otp: string;
}

export interface IVerifyOtpResponseDTO {
  success: boolean;
  message: string;
}

export interface IResetPasswordRequestDTO {
  email: string;
  password: string;
}

export interface IResetPasswordResponseDTO {
  success: boolean;
  message: string;
}

export interface IUpdateProfileRequestDTO {
  bio?: string;
  techStacks?: string[];
  learningGoals?: string[];
  experience?: string;
  developerRole?: string;
  imageUrl?: string;
}

export interface IUpdateProfileResponseDTO {
  success: boolean;
  user: IUserPublicDTO;
  message: string;
}

export interface IRefreshAccessTokenResponseDTO{
  success: boolean;
  newAccessToken: string;
  message: string;
}

export interface IGetUserProfileResponseDTO{
  success: true,
  user: IUserPublicDTO,
}