import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { ICheckOnboardingStatusUseCase } from "../../application/interfaces/usecase/payment/check-onboarding-status.js";
import type { ITaskCheckoutSessionUseCase } from "../../application/interfaces/usecase/payment/task-checkout.js";
import type { ICreateConnectedAccountUseCase } from "../../application/interfaces/usecase/payment/create-connected-account.js";
import type { IGenerateOnboardingLinkUseCase } from "../../application/interfaces/usecase/payment/generate-onboarding-link.js";
import {
  TaskMapper,
  type ITaskMapper,
} from "../../application/mappers/task.js";
import {
  UserMapper,
  type IUserMapper,
} from "../../application/mappers/user/user.js";
import type { IStripeService } from "../../application/providers/stripe-service.js";
import { CheckOnboardingStatusUseCase } from "../../application/use-cases/payment/check-onboarding-status.js";
import { TaskCheckoutSessionUseCase } from "../../application/use-cases/payment/task-checkout.js";
import { CreateConnectedAccountUseCase } from "../../application/use-cases/payment/create-connected-account.js";
import { GenerateOnboardingLinkUseCase } from "../../application/use-cases/payment/generate-onboarding-links.js";

import { PaymentController } from "../../presentation/controllers/payment-controller.js";
import { TaskModel } from "../db/models/task-model.js";
import { UserModel } from "../db/models/user-model.js";
import { StripeService } from "../providers/stripe-service.js";
import { TaskRepository } from "../repositories/task-repository.js";
import { UserRepository } from "../repositories/user-repository.js";
import { SubscriptionCheckoutUseCase } from "../../application/use-cases/payment/subscription-checkout.js";
import {
  PlanMapper,
  type IPlanMapper,
} from "../../application/mappers/admin/plan.js";
import { PlanRepository } from "../repositories/plan.repository.js";
import type { IPlanRepository } from "../../application/interfaces/repository/plan.repository.js";
import { PlanModel } from "../db/models/plans.model.js";
import type { ISubscriptionCheckoutUseCase } from "../../application/interfaces/usecase/payment/subscription-checkout.js";
import { SubscriptionModel } from "../db/models/subscription.js";
import { SubscriptionRepository } from "../repositories/subscription.repository.js";
import type { ISubscriptionRepository } from "../../application/interfaces/repository/subscription.repository.js";

export class PaymentDependencyContainer {
  private readonly _taskRepository: ITaskRepository;
  private readonly _taskMapper: ITaskMapper;
  private readonly _paymentService: IStripeService;
  private readonly _userRepository: IUserRepository;
  private readonly _userMapper: IUserMapper;
  private readonly _planRepository: IPlanRepository;
  private readonly _planMapper: IPlanMapper;
  private readonly _subscriptionRepository: ISubscriptionRepository;

  constructor() {
    this._taskRepository = new TaskRepository(TaskModel);
    this._userRepository = new UserRepository(UserModel);
    this._planRepository = new PlanRepository(PlanModel);
    this._subscriptionRepository = new SubscriptionRepository(
      SubscriptionModel
    );
    this._taskMapper = new TaskMapper();
    this._paymentService = new StripeService();
    this._userMapper = new UserMapper();
    this._planMapper = new PlanMapper();
  }

  createCheckoutSessionUseCase(): ITaskCheckoutSessionUseCase {
    return new TaskCheckoutSessionUseCase(
      this._taskRepository,
      this._taskMapper,
      this._paymentService
    );
  }

  createConnectAccountUseCase(): ICreateConnectedAccountUseCase {
    return new CreateConnectedAccountUseCase(
      this._paymentService,
      this._userRepository,
      this._userMapper
    );
  }

  createGenerateOnboardingLinkUseCase(): IGenerateOnboardingLinkUseCase {
    return new GenerateOnboardingLinkUseCase(
      this._paymentService,
      this._userRepository,
      this._userMapper
    );
  }

  createCheckOnboardingStatusUseCase(): ICheckOnboardingStatusUseCase {
    return new CheckOnboardingStatusUseCase(
      this._userRepository,
      this._userMapper,
      this._paymentService
    );
  }

  createSubscriptionCheckoutUseCase(): ISubscriptionCheckoutUseCase {
    return new SubscriptionCheckoutUseCase(
      this._planRepository,
      this._subscriptionRepository,
      this._planMapper,
      this._paymentService
    );
  }

  // ----------------
  // Payment Controller
  // ----------------
  createPaymentController(): PaymentController {
    return new PaymentController(
      this.createCheckoutSessionUseCase(),
      this.createConnectAccountUseCase(),
      this.createGenerateOnboardingLinkUseCase(),
      this.createCheckOnboardingStatusUseCase(),
      this.createSubscriptionCheckoutUseCase()
    );
  }
}
