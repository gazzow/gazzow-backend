export enum ResponseMessages {
  // Auth
  LoginSuccess = "Login successful",
  LoginFailed = "Invalid email or password",
  Unauthorized = "Unauthorized: No token provided",
  NoRefreshToken = "Unauthorized: No refresh token provided",
  InvalidRefreshToken = "Unauthorized: Invalid refresh token",
  AccessTokenRefreshed = "New access token generated successfully",
  LogoutSuccess = "Logged out successfully",
  OtpVerified = "OTP verified",
  InvalidVerificationCode = "Invalid verification code",
  VerificationCodeExpired = "Verification code has expired",

  // User
  UserNotFound = "User not found",
  UserAlreadyExists = "User already in use",
  UserRetrieved = "User retrieved successfully",
  UserCreated = "User created successfully",
  ProfileUpdated = "Profile updated successfully",
  UserBlocked = "User has been blocked",
  UserStatusUpdated = "User status updated",
  PasswordUpdatedSuccess = "Password updated successfully",

  // System
  Forbidden = "Access denied",
  BadRequest = "Invalid request data",
  InternalServerError = "Internal server error",

  // Admin
  AdminNotFound = "Admin not found",
  FetchedUsers = "Users fetched successfully",
}
