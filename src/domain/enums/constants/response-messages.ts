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
  AdminDashboardDataFetched = "Retrieved admin dashboard data successfully",

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
  ProjectAlreadyDeleted = "Project has already been deleted",
  UnableToDeleteProjectWithActiveTasks = "Unable to delete project with active tasks",
  ProjectDeleted = "Project deleted successfully",

  // Contributor
  FetchedContributors = "Contributors fetched successfully",
  ContributorNotFoundInProject = "User is not a contributor of this project",
  ContributorStatusUpdated = "Contributor status updated successfully",
  UnableToFindContributor = "Unable to find contributor",

  //Application
  ApplicationAlreadyExists = "Application already exists",
  ApplicationSubmitted = "Application submitted successfully",
  ApplicationNotFound = "Application not found",
  FetchedApplications = "Applications fetched successfully",
  ApplicationStatusUpdated = "Application status updated",
  SelfApplicationNotAllowed = "You cannot apply to your own project",

  // Task
  TaskIdIsRequired = "Task is required",
  TaskCreated = "Task created successfully",
  FetchedTasks = "Tasks fetched successfully",
  TaskNotFound = "Task not found",
  TaskUpdateFailed = "Task update failed",
  TaskUpdateSuccess = "Task update successfully",
  TaskRetrieved = "Task retrieved successfully",
  AssigneeIdIsRequired = "AssigneeId is required",
  TaskAlreadyPaid = "Task has already been paid",
  TaskFundAlreadyReleased = "Fund have already been released for this task",
  TaskReassigned = "Task reassigned successfully",
  TaskAlreadyAssignedToUser = "Task is already assigned to this user",
  UserIsNotAProjectContributor = "The selected user is not a contributor to this project.",
  UseReassignOptionToChangeAssignee = "Task already has an assignee. Use the reassign endpoint to change assignee.",
  UnableToPayForThisTask = "Unable to pay for this task",
  UnableToUpdateTaskWhileInProgress = "This task cannot be updated once work has started",
  UnableToReassignTaskWhileInProgress = "This task cannot be reassigned once work has started.",
  CannotReassignWithoutAssignee = "This task cannot be reassigned because it has no current assignee.",
  UnableToStartTask = "Unable to start work this task",
  UnableToSubmitTask = "Unable to submit this task",
  UnableToMarkAsCompleted = "Unable to mark this task as completed",
  UnauthorizedTaskModification = "Unauthorized to modify this task",
  UnauthorizedTaskCreation = "You don't have permission to create tasks for this project",

  // TaskComment
  TaskCommentCreated = "Task Comment posted",
  FetchedTaskComments = "Task Comments fetched successfully",

  // Stripe
  StripeAccountCreated = "Stripe account created successfully",
  StripeAccountLinkGenerated = "Stripe account link generated successfully",
  StripeAccountIdNotFound = "Stripe accountId not found",
  StripeAccountOnboardingIncomplete = "Your Stripe account is not completely onboarded",
  ContributorStripeAccountOnboardingInComplete = "Contributor's Stripe account is not fully onboarded",
  CheckoutSessionCreated = "Checkout session created successfully",
  FailedToCreateCheckoutSession = "Failed to create checkout session",
  OnboardingStatusFetched = "Onboarding status fetched successfully",
  OnboardingUrlGenerated = "Onboarding URL generated successfully",

  // Plan
  PlanAlreadyExists = "Plan already exist.",
  PlanCreated = "Plan created successfully",
  FetchedPlans = "Plans fetched successfully ",
  PlanRetrieved = "Plan retrieved successfully",
  PlanIdIsRequired = "Plan is is required",
  PlanNotFound = "Plan not found",

  // Subscription
  UserAlreadySubscribed = "You already has an active subscription",
  FailedToUpgradeSubscription = "Failed to upgrade subscription",
  FetchUserSubscription = "Retrieved user active subscription",
  SubscriptionNotFound = "Subscription not found.",
  SubscriptionCancelled = "Subscription cancelled successfully",

  // Favorite
  ProjectMarkedAsFavorite = "Project marked as favorite.",
  FetchedFavoriteProjects = "Fetched favorite projects successfully",
  RemoveProjectFromFavorite = "Project removed from favorites successfully",
  FavoriteNotFound = "Favorite not found or already removed",
  ProjectAlreadyAddedToFavorite = "Project already added to favorite",

  // Team Chat
  FetchedTeamChatMessages = "Retrieved team messages successfully",
  MessageNotFound = "Message Not found",
  UnauthorizedToDeleteMessage = "Unauthorized to delete this message",
  MessageDeleted = "Message deleted successfully",
  MessageIdIsRequired = "Message is required",
  MessageAlreadyDeleted = "Message already deleted.",

  // Payments
  FetchedPayments = "List payments successfully",

  // Notification
  NotificationMarkedAsRead = "Notification marked as read",
  UnreadNotificationCountRetrieved = "Unread notification count retrieved successfully",
  NotificationNotFound = "Notification Not found",
  FetchedNotifications = "List Notifications Successfully",
}
