import express from "express";
import { TaskDependencyContainer } from "../../infrastructure/dependency-injection/task-dependency-container.js";

const router = express.Router({ mergeParams: true });

const taskContainer = new TaskDependencyContainer();
const taskController = taskContainer.createTaskController();

router.post("/", taskController.createTask);
router.patch("/:taskId", taskController.updateTask);
router.get("/contributor", taskController.listTasksByContributor);
router.get("/creator", taskController.listTasksByCreator);

export default router;
