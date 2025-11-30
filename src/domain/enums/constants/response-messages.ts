export enum ResponseMessages {
  // Auth
  LoginSuccess = "Login successful",
  LoginFailed = "Invalid email or password",
  LogoutSuccess = "Logged out successfully",
  Unauthorized = "Unauthorized: No token provided",
  PasswordUpdatedSuccess = "Password updated successfully",

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
  UserBlocked = "User has been blocked",
  ProfileUpdated = "Profile updated successfully",
  UserStatusUpdated = "User status updated",
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
  ProjectUpdateFailed = "Project update failed",
  ProjectUpdateSuccess = "Project update successfully",
  ProjectIdIsRequired = "Project is required",
  UnauthorizedProjectModification = "Unauthorized to modify this project",
  GeneratedSignedUrl = "Generated signed url successfully",

  // Contributor
  FetchedContributors = "Contributors fetched successfully",

  //Application
  ApplicationAlreadyExists = "Application already exists",
  ApplicationSubmitted = "Application submitted successfully",
  ApplicationNotFound = "Application not found",
  FetchedApplications = "Applications fetched successfully",
  ApplicationStatusUpdated = "Application status updated",
  SelfApplicationNotAllowed = "You cannot apply to your own project",

  // Task
  TaskIdIsRequired = "Task is required",
  FetchedTasks = "Tasks fetched successfully",
  TaskNotFound = "Task not found",
  TaskUpdateFailed = "Task update failed",
  TaskUpdateSuccess = "Task update successfully",
  UnauthorizedTaskModification = "Unauthorized to modify this task",
  UnauthorizedTaskCreation = "You don't have permission to create tasks for this project",
}
