import { Router } from "express";
import { AuthDependencyContainer } from "../../../di/auth/auth-dependency-container.js";
import { UserDependencyContainer } from "../../../di/user/user-dependency-container.js";

const userRouter = Router();

const authContainer = new AuthDependencyContainer();
const userContainer = new UserDependencyContainer();

const tokenMiddleware = authContainer.createTokenMiddleware();
const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

const authController = authContainer.createAuthController();
const userController = userContainer.createUserController();

userRouter.post("/auth/register", authController.register);
userRouter.post("/auth/verify-otp", authController.verifyUser);
userRouter.post("/auth/login", authController.login);
userRouter.post("/auth/forgot-password", authController.forgotPassword);
userRouter.post("/auth/forgot-password/verify-otp", authController.verifyOtp);
userRouter.put("/auth/reset-password", authController.resetPassword);

userRouter.post("/auth/refresh", authController.refreshAccessToken);

userRouter.post(
  "/auth/logout",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  authController.logout
);

userRouter.put(
  "/profile/setup",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  userController.updateProfile
);
userRouter.get(
  "/profile/me",
  tokenMiddleware.verifyToken,
  userController.getUserProfile
);

export default userRouter;
