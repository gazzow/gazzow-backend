import express from "express";
import { ProjectDependencyContainer } from "../../infrastructure/dependency-injection/project-dependency-container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";
import { upload } from "../middleware/upload.js";
import taskRouter from "./task-routes.js";

const router = express.Router();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();

const projectContainer = new ProjectDependencyContainer();
const projectController = projectContainer.createProjectController();

// Project routes
router.post(
  "/",
  tokenMiddleware.verifyToken,
  upload.array("files"),
  projectController.createProject
);
router.get("/", tokenMiddleware.verifyToken, projectController.listProjects);
router.get(
  "/me",
  tokenMiddleware.verifyToken,
  projectController.listMyProjects
);

// ----------------------
// 📁  Generate Signed Url Route
// ----------------------
router.get(
  "/generate-signed-url",
  tokenMiddleware.verifyToken,
  projectController.generateSignedUrl
);


router.get(
  "/:projectId",
  tokenMiddleware.verifyToken,
  projectController.getProject
);
router.patch(
  "/:projectId",
  tokenMiddleware.verifyToken,
  projectController.updateProject
);

// ----------------------
// 📁 Application Routes
// ----------------------

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
router.patch(
  "/:projectId/applications/:applicationId",
  tokenMiddleware.verifyToken,
  projectController.updateApplicationStatus
);

router.get(
  "/:projectId/contributors",
  tokenMiddleware.verifyToken,
  projectController.listContributors
);

// ----------------------
// 📁 Task Routes
// ----------------------
router.use("/:projectId/tasks", tokenMiddleware.verifyToken, taskRouter);

export default router;
