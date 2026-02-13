import type { IProjectRepository } from "../../application/interfaces/repository/project-repository.js";
import type { ISubscriptionRepository } from "../../application/interfaces/repository/subscription.repository.js";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { IReleaseFundsUseCase } from "../../application/interfaces/usecase/payment/release-fund.js";
import type { ICompleteTaskUseCase } from "../../application/interfaces/usecase/task/complete-task.js";
import type { ICreateTaskUseCase } from "../../application/interfaces/usecase/task/create-task.js";
import type { IGetTaskUseCase } from "../../application/interfaces/usecase/task/get-task.js";
import type { IListTasksByContributorUseCase } from "../../application/interfaces/usecase/task/list-tasks-by-contributor.js";
import type { IListTasksByCreatorUseCase } from "../../application/interfaces/usecase/task/list-tasks-by-creator.js";
import type { IReassignTaskUseCase } from "../../application/interfaces/usecase/task/reassign-task.js";
import type { IStartWorkUseCase } from "../../application/interfaces/usecase/task/start-task.js";
import type { ISubmitTaskUseCase } from "../../application/interfaces/usecase/task/submit-task.js";
import type { IUpdateTaskUseCase } from "../../application/interfaces/usecase/task/update-task.js";
import {
  PaymentMapper,
  type IPaymentMapper,
} from "../../application/mappers/payment.js";
import {
  ProjectMapper,
  type IProjectMapper,
} from "../../application/mappers/project.js";
import {
  SubscriptionMapper,
  type ISubscriptionMapper,
} from "../../application/mappers/subscription.js";
import {
  TaskMapper,
  type ITaskMapper,
} from "../../application/mappers/task.js";
import {
  UserMapper,
  type IUserMapper,
} from "../../application/mappers/user/user.js";
import type { IS3FileStorageService } from "../../application/providers/storage-service.js";
import type { IStripeService } from "../../application/providers/stripe-service.js";
import { ReleaseFundsUseCase } from "../../application/use-cases/payment/release-fund.js";
import { CompleteTaskUseCase } from "../../application/use-cases/task/complete-task.js";
import { CreateTaskUseCase } from "../../application/use-cases/task/create-task.js";
import { GetTaskUseCase } from "../../application/use-cases/task/get-task.js";
import { ListTasksByContributorUseCase } from "../../application/use-cases/task/list-tasks-by-contributor.js";
import { ListTasksByCreatorUseCase } from "../../application/use-cases/task/list-tasks-by-creator.js";
import { ReassignTaskUseCase } from "../../application/use-cases/task/reassign-task.js";
import { StartWorkUseCase } from "../../application/use-cases/task/start-task.js";
import { SubmitTaskUseCase } from "../../application/use-cases/task/submit-task.js";
import { UpdateTaskUseCase } from "../../application/use-cases/task/update-task.js";
import { TaskController } from "../../presentation/controllers/task-controller.js";
import { PaymentModel } from "../db/models/payment.model.js";
import { ProjectModel } from "../db/models/project-model.js";
import { SubscriptionModel } from "../db/models/subscription.js";
import { TaskModel } from "../db/models/task-model.js";
import { UserModel } from "../db/models/user-model.js";
import { S3FileStorageService } from "../providers/s3-service.js";
import { StripeService } from "../providers/stripe-service.js";
import {
  PaymentRepository,
  type IPaymentRepository,
} from "../repositories/payment.repository.js";
import { ProjectRepository } from "../repositories/project-repository.js";
import { SubscriptionRepository } from "../repositories/subscription.repository.js";
import { TaskRepository } from "../repositories/task-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

export class TaskDependencyContainer {
  private readonly _taskRepository: ITaskRepository;
  private readonly _taskMapper: ITaskMapper;
  private readonly _projectRepository: IProjectRepository;
  private readonly _projectMapper: IProjectMapper;
  private readonly _userRepository: IUserRepository;
  private readonly _userMapper: IUserMapper;
  private readonly _stripeService: IStripeService;
  private readonly _s3Service: IS3FileStorageService;
  private readonly _subscriptionRepository: ISubscriptionRepository;
  private readonly _subscriptionMapper: ISubscriptionMapper;
  private readonly _paymentRepository: IPaymentRepository;
  private readonly _paymentMapper: IPaymentMapper;

  constructor() {
    this._taskRepository = new TaskRepository(TaskModel);
    this._taskMapper = new TaskMapper();
    this._projectRepository = new ProjectRepository(ProjectModel);
    this._projectMapper = new ProjectMapper();
    this._userRepository = new UserRepository(UserModel);
    this._userMapper = new UserMapper();
    this._stripeService = new StripeService();
    this._s3Service = new S3FileStorageService();
    this._subscriptionRepository = new SubscriptionRepository(
      SubscriptionModel
    );
    this._paymentRepository = new PaymentRepository(PaymentModel);
    this._subscriptionMapper = new SubscriptionMapper();
    this._paymentMapper = new PaymentMapper();
  }

  createTaskUseCase(): ICreateTaskUseCase {
    return new CreateTaskUseCase(
      this._taskRepository,
      this._projectRepository,
      this._taskMapper,
      this._s3Service
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
    return new UpdateTaskUseCase(
      this._taskRepository,
      this._projectRepository,
      this._projectMapper,
      this._taskMapper
    );
  }

  createGetTaskUseCase(): IGetTaskUseCase {
    return new GetTaskUseCase(this._taskRepository, this._taskMapper);
  }

  createStartWorkUseCase(): IStartWorkUseCase {
    return new StartWorkUseCase(
      this._taskRepository,
      this._userRepository,
      this._taskMapper,
      this._userMapper,
      this._stripeService
    );
  }

  createSubmitTaskUseCase(): ISubmitTaskUseCase {
    return new SubmitTaskUseCase(this._taskRepository, this._taskMapper);
  }

  createReleaseFundsUseCase(): IReleaseFundsUseCase {
    return new ReleaseFundsUseCase(
      this._taskRepository,
      this._userRepository,
      this._taskMapper,
      this._userMapper,
      this._stripeService,
      this._subscriptionRepository,
      this._subscriptionMapper,
      this._paymentRepository,
      this._paymentMapper
    );
  }

  createCompleteTaskUseCase(): ICompleteTaskUseCase {
    return new CompleteTaskUseCase(
      this._taskRepository,
      this._taskMapper,
      this.createReleaseFundsUseCase()
    );
  }

  createReassignTaskUseCase(): IReassignTaskUseCase {
    return new ReassignTaskUseCase(
      this._taskRepository,
      this._projectRepository,
      this._projectMapper,
      this._taskMapper,
    );
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
      this.createCompleteTaskUseCase(),
      this.createReassignTaskUseCase()
    );
  }
}
