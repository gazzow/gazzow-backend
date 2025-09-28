import type { Provider, UserRole, UserStatus } from "../enums/user-role.js";

export interface IUserPublicDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  googleId?: string;
  provider: Provider;
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
  data: IUserPublicDTO;
}

export interface IForgotPasswordRequestDTO {
  email: string;
}


export interface IVerifyOtpRequestDTO {
  email: string;
  otp: string;
}



export interface IResetPasswordRequestDTO {
  email: string;
  password: string;
}


export interface IUpdateProfileRequestDTO {
  name?: string;
  bio?: string;
  techStacks?: string[];
  learningGoals?: string[];
  experience?: string;
  developerRole?: string;
  imageUrl?: string;
}

export interface IUpdateProfileResponseDTO {
  data: IUserPublicDTO;
}

export interface IRefreshAccessTokenResponseDTO {
  accessToken: string;
}

export interface IGetUserProfileResponseDTO {
  data: IUserPublicDTO;
}

export interface IGoogleAuthResponseDTO{
  data: IUserPublicDTO,
}