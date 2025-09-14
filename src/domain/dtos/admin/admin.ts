import type { IUserPublic } from "../../entities/user.js";
import type { UserStatus } from "../../enums/user-role.js";

export interface IAdminDTO {
  email: string;
  role: string;
}

export interface IAdminLoginResponseDTO {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  admin: IAdminDTO;
}

export interface IUserBlockRequestDTO {
  status: UserStatus;
}

export interface IUserBlockResponseDTO {
  success: boolean;
  message: string;
  user: IUserPublic;
}

export interface IGetUserResponseDTO {
  success: boolean;
  message: string;
  user: IUserPublic;
}
