import { Router } from "express";
import { validateLogin } from "../../middleware/validators/admin/validate-login.js";
import { AdminDependencyContainer } from "../../../infrastructure/composers/admin-dependency-container.js";

const adminRouter = Router();

const adminContainer = new AdminDependencyContainer();

const adminAuthController = adminContainer.createAuthController();
const userManagementController = adminContainer.createUserManagementController();

const verifyMiddleware = adminContainer.createVerifyAdminMiddleware();

adminRouter.post("/auth/login",validateLogin, adminAuthController.login);

adminRouter.get(
  "/users",
  verifyMiddleware.isAdmin,
  userManagementController.listUsers
);
adminRouter.get(
  "/users/:id",
  verifyMiddleware.isAdmin,
  userManagementController.getUser
);
adminRouter.patch(
  "/users/:id/status",
  verifyMiddleware.isAdmin,
  userManagementController.blockUser
);

export default adminRouter;
