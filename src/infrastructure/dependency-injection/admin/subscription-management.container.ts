import type { ISubscriptionRepository } from "../../../application/interfaces/repository/subscription.repository.js";
import type { IListSubscriptionsUseCase } from "../../../application/interfaces/usecase/admin/subscription/list-subscriptions.js";
import {
  SubscriptionMapper,
  type ISubscriptionMapper,
} from "../../../application/mappers/subscription.js";
import {
  CancelSubscriptionUseCase,
  type ICancelSubscriptionUseCase,
} from "../../../application/use-cases/admin/subscription/cancel-subscription.js";
import { ListSubscriptionsUseCase } from "../../../application/use-cases/admin/subscription/list-subscriptions.js";
import { SubscriptionManagementController } from "../../../presentation/controllers/admin/subscription-management.controller.js";
import { SubscriptionModel } from "../../db/models/subscription.js";
import { SubscriptionRepository } from "../../repositories/subscription.repository.js";

export class SubscriptionManagementDependencyContainer {
  private readonly _subscriptionRepository: ISubscriptionRepository;
  private readonly _subscriptionMapper: ISubscriptionMapper;

  constructor() {
    this._subscriptionRepository = new SubscriptionRepository(
      SubscriptionModel
    );
    this._subscriptionMapper = new SubscriptionMapper();
  }

  private createListSubscriptionsUseCase(): IListSubscriptionsUseCase {
    return new ListSubscriptionsUseCase(
      this._subscriptionRepository,
      this._subscriptionMapper
    );
  }

  private createCancelSubscriptionUseCase(): ICancelSubscriptionUseCase {
    return new CancelSubscriptionUseCase(this._subscriptionRepository);
  }

  // Subscription Management Controller
  createSubscriptionController(): SubscriptionManagementController {
    return new SubscriptionManagementController(
      this.createListSubscriptionsUseCase(),
      this.createCancelSubscriptionUseCase()
    );
  }
}
