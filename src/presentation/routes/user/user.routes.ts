import { Router } from "express";
import { passport } from "../../../infrastructure/config/passport.js";
import { AuthDependencyContainer } from "../../../infrastructure/dependency-injection/auth-dependency-container.js";
import { UserDependencyContainer } from "../../../infrastructure/dependency-injection/user-dependency-container.js";

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
userRouter.post("/auth/resend-otp", authController.resendOtp);

userRouter.post("/auth/refresh", authController.refreshAccessToken);

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback,
);

userRouter.post(
  "/auth/logout",
  tokenMiddleware.verifyToken,
  authController.logout,
);

userRouter.put(
  "/profile/update",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  userController.updateProfile,
);
userRouter.get(
  "/profile/me",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  userController.getUserProfile,
);

userRouter.get(
  "/dashboard",
  tokenMiddleware.verifyToken,
  userController.dashboardStats,
);

export default userRouter;
