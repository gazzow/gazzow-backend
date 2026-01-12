import { Router } from "express";
import { validateLogin } from "../../middleware/validators/admin/validate-login.js";
import { AdminDependencyContainer } from "../../../infrastructure/dependency-injection/admin-dependency-container.js";

const adminRouter = Router();

const adminContainer = new AdminDependencyContainer();

const adminAuthController = adminContainer.createAuthController();

const userManagementController =
  adminContainer.createUserManagementController();

const projectController = adminContainer.createProjectController();

const verifyMiddleware = adminContainer.createVerifyAdminMiddleware();

adminRouter.post("/auth/login", validateLogin, adminAuthController.login);

//------------------
// User Routes
//------------------

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

//------------------
// Project Routes
//------------------

adminRouter.get(
  "/projects",
  verifyMiddleware.isAdmin,
  projectController.listProjects
);

adminRouter.get(
  "/projects/:projectId",
  verifyMiddleware.isAdmin,
  projectController.getProject
);

export default adminRouter;
