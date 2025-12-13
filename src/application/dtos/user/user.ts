import type {
  Provider,
  UserRole,
  UserStatus,
} from "../../../domain/enums/user-role.js";
import type { OtpPurpose } from "../../../domain/types/auth.js";

export interface IUserPublicDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  googleId?: string;
  provider: Provider;
  isNewUser?: boolean;
  bio?: string;
  techStacks?: string[];
  learningGoals?: string[];
  experience?: string;
  developerRole?: string;
  imageUrl?: string;
  stripeAccountId: string | null;
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

export interface IResendOtpRequestDTO {
  email: string;
  purpose: OtpPurpose;
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

export interface IGoogleAuthResponseDTO {
  data: IUserPublicDTO;
  isNewUser: boolean;
}
