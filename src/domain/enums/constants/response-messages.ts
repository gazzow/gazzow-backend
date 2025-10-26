export enum ResponseMessages {
  // Auth
  LoginSuccess = "Login successful",
  LoginFailed = "Invalid email or password",
  LogoutSuccess = "Logged out successfully",
  Unauthorized = "Unauthorized: No token provided",

  // JWT Token
  NoRefreshToken = "Unauthorized: No refresh token provided",
  AccessTokenRefreshed = "New access token generated successfully",
  InvalidRefreshToken = "Unauthorized: Invalid refresh token",

  // OTP
  OtpVerified = "OTP verified successfully",
  OtpHasBeenSent = "OTP has been sent. Please check your email.",
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
  FetchedUsers = "Users fetched successfully",

  // System
  Forbidden = "Access denied",
  BadRequest = "Invalid request data",
  InternalServerError = "Internal server error",

  // Admin
  AdminNotFound = "Admin not found",

  // Project
  ProjectCreated = "Project created successfully",
  FetchedProjects = "Projects fetched successfully",
  ProjectRetrieved = "Project retrieved successfully",
  ProjectNotFound = "Project not found",

  //Application
  ApplicationAlreadyExists = "Application already exists",
  ApplicationSubmitted = "Application submitted successfully",
  ApplicationNotFound = "Application not found",
  FetchedApplications = "Applications fetched successfully",
  ApplicationStatusUpdated = "Application status updated",
  SelfApplicationNotAllowed = "You cannot apply to your own project",
}
