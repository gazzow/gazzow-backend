import type { IUserPublic } from "../../entities/user.js";
import type { UserRole, UserStatus, SortOrder } from "../../enums/user-role.js";

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
  accessToken: string;
  refreshToken: string;
  data: IAdminDTO;
}

export interface IAdminListUsersRequestDTO {
  search?: string;
  status?: string;
  role?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  skip?: number;
  limit?: number;
}

export interface IAdminListUsersResponseDTO {
  data: IUserPublic[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface IUserBlockRequestDTO {
  status: UserStatus;
}

export interface IUserBlockResponseDTO {
  data: IUserPublic;
}

export interface IGetUserResponseDTO {
  data: IUserPublic;
}
