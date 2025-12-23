import type { IPlanRepository } from "../../application/interfaces/repository/plan.repository.js";
import type { ISubscriptionRepository } from "../../application/interfaces/repository/subscription.repository.js";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { IHandleStripeWebhookUseCase } from "../../application/interfaces/usecase/handle-stripe-webhook.js";
import type { ITaskPaymentUseCase } from "../../application/interfaces/usecase/payment/task-payment.js";
import type { ISubscriptionPaymentUseCase } from "../../application/interfaces/usecase/subscription/subscription-payment.js";
import {
  PlanMapper,
  type IPlanMapper,
} from "../../application/mappers/admin/plan.js";
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
import type { IStripeService } from "../../application/providers/stripe-service.js";
import { HandleStripeWebhookUseCase } from "../../application/use-cases/handle-strip-webhook.js";
import { TaskPaymentUseCase } from "../../application/use-cases/payment/task-payment.js";
import { SubscriptionPaymentUseCase } from "../../application/use-cases/subscription/subscription-payment.js";
import { StripeWebhookController } from "../../presentation/controllers/webhook-controller.js";
import { PlanModel } from "../db/models/plans.model.js";
import { SubscriptionModel } from "../db/models/subscription.js";
import { TaskModel } from "../db/models/task-model.js";
import { UserModel } from "../db/models/user-model.js";
import { StripeService } from "../providers/stripe-service.js";
import { PlanRepository } from "../repositories/plan.repository.js";
import { SubscriptionRepository } from "../repositories/subscription.repository.js";
import { TaskRepository } from "../repositories/task-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

export class WebhookDependencyContainer {
  private readonly _paymentService: IStripeService;
  private readonly _taskRepository: ITaskRepository;
  private readonly _taskMapper: ITaskMapper;
  private readonly _userRepository: IUserRepository;
  private readonly _userMapper: IUserMapper;
  private readonly _planRepository: IPlanRepository;
  private readonly _planMapper: IPlanMapper;
  private readonly _subscriptionRepository: ISubscriptionRepository;
  private readonly _subscriptionMapper: ISubscriptionMapper;

  constructor() {
    this._paymentService = new StripeService();
    this._taskRepository = new TaskRepository(TaskModel);
    this._taskMapper = new TaskMapper();
    this._userRepository = new UserRepository(UserModel);
    this._userMapper = new UserMapper();
    this._planRepository = new PlanRepository(PlanModel);
    this._planMapper = new PlanMapper();
    this._subscriptionRepository = new SubscriptionRepository(
      SubscriptionModel
    );
    this._subscriptionMapper = new SubscriptionMapper();
  }

  createTaskPaymentUseCase(): ITaskPaymentUseCase {
    return new TaskPaymentUseCase(this._taskRepository, this._taskMapper);
  }

  createSubscriptionPaymentUseCase(): ISubscriptionPaymentUseCase {
    return new SubscriptionPaymentUseCase(
      this._userRepository,
      this._subscriptionRepository,
      this._planRepository,
      this._planMapper,
      this._subscriptionMapper
    );
  }

  createHandleStripeWebhookUseCase(): IHandleStripeWebhookUseCase {
    return new HandleStripeWebhookUseCase(
      this._paymentService,
      this.createTaskPaymentUseCase(),
      this.createSubscriptionPaymentUseCase()
    );
  }

  // Webhook Controller
  createStripeWebhookController(): StripeWebhookController {
    return new StripeWebhookController(this.createHandleStripeWebhookUseCase());
  }
}
