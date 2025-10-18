import express from "express";
import { ProjectDependencyContainer } from "../../infrastructure/composers/project-dependency-container.js";
import { AuthDependencyContainer } from "../../infrastructure/composers/auth-dependency-container.js";

const router = express.Router();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();

const projectContainer = new ProjectDependencyContainer();
const projectController = projectContainer.createProjectController();

// Project routes
router.post("/", tokenMiddleware.verifyToken, projectController.createProject);
router.get("/", tokenMiddleware.verifyToken, projectController.listProjects);

// Application routes
router.post(
  "/:projectId/applications",
  tokenMiddleware.verifyToken,
  projectController.createApplication
);
router.get(
  "/:projectId/applications",
  tokenMiddleware.verifyToken,
  projectController.listApplications
);

export default router;