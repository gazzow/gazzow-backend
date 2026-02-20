import express from "express";
import { ProjectDependencyContainer } from "../../infrastructure/dependency-injection/project-dependency-container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";
import { upload } from "../middleware/upload.js";
import taskRouter from "./task.routes.js";
import type { IRealtimeGateway } from "../../infrastructure/config/socket/socket-gateway.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProjectSchema } from "../validators/user/create-project.validator.js";
import { updateProjectSchema } from "../validators/user/update-project.validator.js";
import { applyProjectSchema } from "../validators/user/apply-project.validator.js";

export const createProjectRouter = (socketGateway: IRealtimeGateway) => {
  const router = express.Router();

  const authContainer = new AuthDependencyContainer();
  const tokenMiddleware = authContainer.createTokenMiddleware();
  const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

  const projectContainer = new ProjectDependencyContainer(socketGateway);
  const projectController = projectContainer.createProjectController();

  // Project routes
  router.post(
    "/",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    upload.array("files"),
    validate(createProjectSchema),
    projectController.createProject,
  );

  router.get(
    "/",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    projectController.listProjects,
  );

  router.get(
    "/me",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    projectController.listMyProjects,
  );

  router.delete(
    "/:projectId",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    projectController.deleteProject,
  );

  // ----------------------
  // 📁  Generate Signed Url Route
  // ----------------------
  router.get(
    "/generate-signed-url",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    projectController.generateSignedUrl,
  );

  router.get(
    "/:projectId",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    projectController.getProject,
  );
  router.put(
    "/:projectId",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    validate(updateProjectSchema),
    projectController.updateProject,
  );

  // ----------------------
  // 📁 Application Routes
  // ----------------------

  router.post(
    "/:projectId/applications",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    validate(applyProjectSchema),
    projectController.createApplication,
  );
  router.get(
    "/:projectId/applications",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    projectController.listApplications,
  );
  router.patch(
    "/:projectId/applications/:applicationId",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    projectController.updateApplicationStatus,
  );

  router.get(
    "/:projectId/contributors",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    projectController.listContributors,
  );

  router.patch(
    "/:projectId/contributors",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    projectController.updateContributorStatus,
  );

  // ----------------------
  // 📁 Task Routes
  // ----------------------
  router.use(
    "/:projectId/tasks",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    taskRouter,
  );

  return router;
};
