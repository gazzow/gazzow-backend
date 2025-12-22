import express from "express";
import { TaskCommentDependencyContainer } from "../../infrastructure/dependency-injection/task-comment.container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";

const router = express.Router();

const taskCommentContainer = new TaskCommentDependencyContainer();
const taskController = taskCommentContainer.createTaskCommentController();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();

router.post("/", tokenMiddleware.verifyToken, taskController.createComment);
router.get("/:taskId", tokenMiddleware.verifyToken, taskController.getComments)

export default router;
