import type { ITaskCommentRepository } from "../../application/interfaces/repository/task-comment.repository.js";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { ICreateTaskCommentUseCase } from "../../application/interfaces/usecase/task-comment/create-comment.js";
import type { IGetTaskCommentsUseCase } from "../../application/interfaces/usecase/task-comment/get-comments.js";
import {
  TaskCommentMapper,
  type ITaskCommentMapper,
} from "../../application/mappers/task-comment.js";
import {
  TaskMapper,
  type ITaskMapper,
} from "../../application/mappers/task.js";
import {
  UserMapper,
  type IUserMapper,
} from "../../application/mappers/user/user.js";
import type { ICreateNotificationUseCase } from "../../application/use-cases/notification/create-notification.js";
import { CreateTaskCommentUseCase } from "../../application/use-cases/task-comment/create-comment.js";
import { GetTaskCommentsUseCase } from "../../application/use-cases/task-comment/get-comments.js";
import { TaskCommentController } from "../../presentation/controllers/task-comment.controller.js";
import { TaskCommentModel } from "../db/models/task-comment.model.js";
import { TaskModel } from "../db/models/task-model.js";
import { UserModel } from "../db/models/user-model.js";
import { TaskCommentRepository } from "../repositories/task-comment.repository.js";
import { TaskRepository } from "../repositories/task-repository.js";
import { UserRepository } from "../repositories/user-repository.js";
import { NotificationDependencyContainer } from "./notification.container.js";

export class TaskCommentDependencyContainer {
  private readonly _taskRepository: ITaskRepository;
  private readonly _userRepository: IUserRepository;
  private readonly _taskCommentRepository: ITaskCommentRepository;
  private readonly _taskMapper: ITaskMapper;
  private readonly _userMapper: IUserMapper;
  private readonly _taskCommentMapper: ITaskCommentMapper;
  private readonly _createNotificationUseCase: ICreateNotificationUseCase;

  constructor() {
    this._taskRepository = new TaskRepository(TaskModel);
    this._userRepository = new UserRepository(UserModel);
    this._taskCommentRepository = new TaskCommentRepository(TaskCommentModel);
    this._taskMapper = new TaskMapper();
    this._userMapper = new UserMapper();
    this._taskCommentMapper = new TaskCommentMapper();
    this._createNotificationUseCase =
      new NotificationDependencyContainer().createNotificationUseCase();
  }

  createTaskCommentUseCase(): ICreateTaskCommentUseCase {
    return new CreateTaskCommentUseCase(
      this._taskRepository,
      this._userRepository,
      this._taskCommentRepository,
      this._userMapper,
      this._taskCommentMapper,
      this._createNotificationUseCase
    );
  }

  createGetTaskCommentsUseCase(): IGetTaskCommentsUseCase {
    return new GetTaskCommentsUseCase(
      this._taskRepository,
      this._taskCommentRepository,
      this._taskMapper,
      this._taskCommentMapper
    );
  }

  // Task Comment Controller
  createTaskCommentController(): TaskCommentController {
    return new TaskCommentController(
      this.createTaskCommentUseCase(),
      this.createGetTaskCommentsUseCase()
    );
  }
}
