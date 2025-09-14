export enum ResponseMessages {
  // Auth
  LoginSuccess = "Login successful",
  LoginFailed = "Invalid email or password",
  Unauthorized = "Unauthorized: No token provided",
  NoRefreshToken = "Unauthorized: No refresh token provided",
  InvalidRefreshToken = "Unauthorized: Invalid refresh token",
  AccessTokenRefreshed = "New access token generated successfully",
  LogoutSuccess  = "Logged out successfully",
  // User
  UserNotFound = "User not found",
  UserCreated = "User created successfully",
  UserUpdated = "User updated successfully",
  UserBlocked = "User has been blocked",
  UserUnblocked = "User has been unblocked",

  // System
  Forbidden = "Access denied",
  BadRequest = "Invalid request data",
  InternalServerError = "Internal server error",
}
