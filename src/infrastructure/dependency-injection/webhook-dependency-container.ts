import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type { IHandleStripeWebhookUseCase } from "../../application/interfaces/usecase/handle-stripe-webhook.js";
import type { ITaskPaymentUseCase } from "../../application/interfaces/usecase/payment/task-payment.js";
import type { IStripeService } from "../../application/providers/stripe-service.js";
import { HandleStripeWebhookUseCase } from "../../application/use-cases/handle-strip-webhook.js";
import { TaskPaymentUseCase } from "../../application/use-cases/payment/task-payment.js";
import { StripeWebhookController } from "../../presentation/controllers/webhook-controller.js";
import { TaskModel } from "../db/models/task-model.js";
import { StripeService } from "../providers/stripe-service.js";
import { TaskRepository } from "../repositories/task-repository.js";

export class WebhookDependencyContainer {
  private readonly _paymentService: IStripeService;
  private readonly _taskRepository: ITaskRepository;

  constructor() {
    this._paymentService = new StripeService();
    this._taskRepository = new TaskRepository(TaskModel);
  }

  createTaskPaymentUseCase(): ITaskPaymentUseCase {
    return new TaskPaymentUseCase(this._taskRepository);
  }

  createHandleStripeWebhookUseCase(): IHandleStripeWebhookUseCase {
    return new HandleStripeWebhookUseCase(
      this._paymentService,
      this.createTaskPaymentUseCase()
    );
  }

  // Webhook Controller
  createStripeWebhookController(): StripeWebhookController {
    return new StripeWebhookController(this.createHandleStripeWebhookUseCase());
  }
}
