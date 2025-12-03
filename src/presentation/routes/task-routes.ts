import express from "express";
import { TaskDependencyContainer } from "../../infrastructure/dependency-injection/task-dependency-container.js";
import logger from "../../utils/logger.js";

const router = express.Router({ mergeParams: true });

const taskContainer = new TaskDependencyContainer();
const taskController = taskContainer.createTaskController();

router.post("/", taskController.createTask);
router.get("/contributor", taskController.listTasksByContributor);
router.get("/creator", taskController.listTasksByCreator);

router.put("/:taskId/start", taskController.startWork);
router.get("/:taskId", taskController.getTask);
router.patch("/:taskId", taskController.updateTask);

export default router;
