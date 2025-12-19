import express from "express";
import { TaskDependencyContainer } from "../../infrastructure/dependency-injection/task-dependency-container.js";

const router = express.Router({ mergeParams: true });

const taskContainer = new TaskDependencyContainer();
const taskController = taskContainer.createTaskController();

router.post("/", taskController.createTask);
router.get("/contributor", taskController.listTasksByContributor);
router.get("/creator", taskController.listTasksByCreator);

router.put("/:taskId/start", taskController.startWork);
router.put("/:taskId/submit", taskController.submitTask);
router.put("/:taskId/complete", taskController.completeTask);

router.patch("/:taskId/reassign", taskController.reassignTask);
router.patch("/:taskId", taskController.updateTask);
router.get("/:taskId", taskController.getTask);

export default router;
