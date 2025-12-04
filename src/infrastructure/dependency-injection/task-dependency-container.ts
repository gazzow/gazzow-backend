import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type { ICompleteTaskUseCase } from "../../application/interfaces/usecase/task/complete-task.js";
import type { ICreateTaskUseCase } from "../../application/interfaces/usecase/task/create-task.js";
import type { IGetTaskUseCase } from "../../application/interfaces/usecase/task/get-task.js";
import type { IListTasksByContributorUseCase } from "../../application/interfaces/usecase/task/list-tasks-by-contributor.js";
import type { IListTasksByCreatorUseCase } from "../../application/interfaces/usecase/task/list-tasks-by-creator.js";
import type { IStartWorkUseCase } from "../../application/interfaces/usecase/task/start-task.js";
import type { ISubmitTaskUseCase } from "../../application/interfaces/usecase/task/submit-task.js";
import type { IUpdateTaskUseCase } from "../../application/interfaces/usecase/task/update-task.js";
import {
  TaskMapper,
  type ITaskMapper,
} from "../../application/mappers/task.js";
import { CompleteTaskUseCase } from "../../application/use-cases/task/complete-task.js";
import { CreateTaskUseCase } from "../../application/use-cases/task/create-task.js";
import { GetTaskUseCase } from "../../application/use-cases/task/get-task.js";
import { ListTasksByContributorUseCase } from "../../application/use-cases/task/list-tasks-by-contributor.js";
import { ListTasksByCreatorUseCase } from "../../application/use-cases/task/list-tasks-by-creator.js";
import { StartWorkUseCase } from "../../application/use-cases/task/start-task.js";
import { SubmitTaskUseCase } from "../../application/use-cases/task/submit-task.js";
import { UpdateTaskUseCase } from "../../application/use-cases/task/update-task.js";
import { TaskController } from "../../presentation/controllers/task-controller.js";
import { ProjectModel } from "../db/models/project-model.js";
import { TaskModel } from "../db/models/task-model.js";
import { ProjectRepository } from "../repositories/project-repository.js";
import { TaskRepository } from "../repositories/task-repository.js";

export class TaskDependencyContainer {
  private readonly _taskRepository: ITaskRepository;
  private readonly _taskMapper: ITaskMapper;
  private readonly _projectRepository: IProjectRepository;

  constructor() {
    this._taskRepository = new TaskRepository(TaskModel);
    this._taskMapper = new TaskMapper();
    this._projectRepository = new ProjectRepository(ProjectModel);
  }

  createTaskUseCase(): ICreateTaskUseCase {
    return new CreateTaskUseCase(
      this._taskRepository,
      this._projectRepository,
      this._taskMapper
    );
  }

  createListTaskByContributor(): IListTasksByContributorUseCase {
    return new ListTasksByContributorUseCase(
      this._taskRepository,
      this._taskMapper
    );
  }

  createListTaskByCreator(): IListTasksByCreatorUseCase {
    return new ListTasksByCreatorUseCase(
      this._taskRepository,
      this._taskMapper
    );
  }

  createUpdateTaskUseCase(): IUpdateTaskUseCase {
    return new UpdateTaskUseCase(this._taskRepository, this._taskMapper);
  }

  createGetTaskUseCase(): IGetTaskUseCase {
    return new GetTaskUseCase(this._taskRepository, this._taskMapper);
  }

  createStartWorkUseCase(): IStartWorkUseCase {
    return new StartWorkUseCase(this._taskRepository);
  }

  createSubmitTaskUseCase(): ISubmitTaskUseCase {
    return new SubmitTaskUseCase(this._taskRepository, this._taskMapper);
  }

  createCompleteTaskUseCase(): ICompleteTaskUseCase {
    return new CompleteTaskUseCase(this._taskRepository, this._taskMapper);
  }

  // ----------------
  // Task Controller
  // ----------------
  createTaskController(): TaskController {
    return new TaskController(
      this.createTaskUseCase(),
      this.createListTaskByContributor(),
      this.createListTaskByCreator(),
      this.createUpdateTaskUseCase(),
      this.createGetTaskUseCase(),
      this.createStartWorkUseCase(),
      this.createSubmitTaskUseCase(),
      this.createCompleteTaskUseCase()
    );
  }
}
