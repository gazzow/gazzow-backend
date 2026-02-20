import express from "express";
import { TaskDependencyContainer } from "../../infrastructure/dependency-injection/task-dependency-container.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema } from "../validators/user/create-task.validator.js";
import { updateTaskSchema } from "../validators/user/update-task.validator.js";

const router = express.Router({ mergeParams: true });

const taskContainer = new TaskDependencyContainer();
const taskController = taskContainer.createTaskController();

router.post(
  "/",
  upload.array("files"),
  validate(createTaskSchema),
  taskController.createTask,
);
router.get("/contributor", taskController.listTasksByContributor);
router.get("/creator", taskController.listTasksByCreator);

router.put("/:taskId/start", taskController.startWork);
router.put("/:taskId/submit", taskController.submitTask);
router.put("/:taskId/complete", taskController.completeTask);

router.patch("/:taskId/reassign", taskController.reassignTask);
router.patch("/:taskId", validate(updateTaskSchema), taskController.updateTask);
router.get("/:taskId", taskController.getTask);

export default router;
