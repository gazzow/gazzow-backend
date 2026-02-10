import express from "express";
import { ProjectDependencyContainer } from "../../infrastructure/dependency-injection/project-dependency-container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";
import { upload } from "../middleware/upload.js";
import taskRouter from "./task.routes.js";
import type { SocketGateway } from "../../infrastructure/config/socket/socket-gateway.js";

export const createProjectRouter = (socketGateway: SocketGateway) => {
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
    projectController.updateProject,
  );

  // ----------------------
  // 📁 Application Routes
  // ----------------------

  router.post(
    "/:projectId/applications",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
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
