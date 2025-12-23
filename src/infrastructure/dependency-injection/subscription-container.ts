import type { IPlanRepository } from "../../application/interfaces/repository/plan.repository.js";
import type { ISubscriptionRepository } from "../../application/interfaces/repository/subscription.repository.js";
import type { IGetSubscriptionUseCase } from "../../application/interfaces/usecase/subscription/get-subscription.js";
import type { IListSubscriptionPlansUseCase } from "../../application/interfaces/usecase/subscription/list-plans.js";
import {
  PlanMapper,
  type IPlanMapper,
} from "../../application/mappers/admin/plan.js";
import {
  SubscriptionMapper,
  type ISubscriptionMapper,
} from "../../application/mappers/subscription.js";
import { GetSubscriptionUseCase } from "../../application/use-cases/subscription/get-subscription.js";
import { ListSubscriptionPlansUseCase } from "../../application/use-cases/subscription/list-plans.js";
import { SubscriptionController } from "../../presentation/controllers/subscription.controller.js";
import { PlanModel } from "../db/models/plans.model.js";
import { SubscriptionModel } from "../db/models/subscription.js";
import { PlanRepository } from "../repositories/plan.repository.js";
import { SubscriptionRepository } from "../repositories/subscription.repository.js";

export class SubscriptionDependencyContainer {
  private readonly _planRepository: IPlanRepository;
  private readonly _planMapper: IPlanMapper;
  private readonly _subscriptionRepository: ISubscriptionRepository;
  private readonly _subscriptionMapper: ISubscriptionMapper;

  constructor() {
    this._planRepository = new PlanRepository(PlanModel);
    this._subscriptionRepository = new SubscriptionRepository(
      SubscriptionModel
    );
    this._planMapper = new PlanMapper();
    this._subscriptionMapper = new SubscriptionMapper();
  }

  createListPlanUseCase(): IListSubscriptionPlansUseCase {
    return new ListSubscriptionPlansUseCase(
      this._planRepository,
      this._planMapper
    );
  }

  createGetSubscriptionUseCase(): IGetSubscriptionUseCase {
    return new GetSubscriptionUseCase(
      this._subscriptionRepository,
      this._subscriptionMapper
    );
  }

  // Subscription Controller
  createSubscriptionController(): SubscriptionController {
    return new SubscriptionController(
      this.createListPlanUseCase(),
      this.createGetSubscriptionUseCase()
    );
  }
}
