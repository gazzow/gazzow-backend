import type { IUserPublic } from "../../entities/user.js";
import type { UserRole, UserStatus } from "../../enums/user-role.js";

export interface IAdminDTO {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface IAdminLoginRequestDTO {
  email: string;
  password: string;
}

export interface IAdminLoginResponseDTO {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  data: IAdminDTO;
}

export interface IAdminListUsersRequestDTO {
  filter?: Record<string, string>;
  skip?: number;
  limit?: number;
}

export interface IAdminListUsersResponseDTO {
  success: true;
  data: IUserPublic[];
  pagination: {
    skip: number,
    limit: number,
    total: number,
  }
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
