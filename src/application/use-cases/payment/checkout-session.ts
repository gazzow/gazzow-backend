import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { PaymentStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  ICreateTaskCheckoutSessionRequestDTO,
  ICreateTaskCheckoutSessionResponseDTO,
} from "../../dtos/payment.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { ITaskCheckoutSessionUseCase } from "../../interfaces/usecase/payment/checkout-session.js";
import type { ITaskMapper } from "../../mappers/task.js";
import type { IStripeService } from "../../providers/stripe-service.js";

export class TaskCheckoutSessionUseCase implements ITaskCheckoutSessionUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper,
    private _paymentService: IStripeService
  ) {}

  async execute(
    dto: ICreateTaskCheckoutSessionRequestDTO
  ): Promise<ICreateTaskCheckoutSessionResponseDTO> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc)
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const task = this._taskMapper.toResponseDTO(taskDoc);

    if (task.paymentStatus === PaymentStatus.PAID)
      throw new AppError(
        ResponseMessages.TaskAlreadyPaid,
        HttpStatusCode.CONFLICT
      );

    const CURRENCY_CODE = "usd";
    const AMOUNT_IN_CENTS = task.proposedAmount * 100;
    
    const checkoutUrl = await this._paymentService.taskCheckoutSession({
      taskId: task.id,
      amountInCents: AMOUNT_IN_CENTS,
      currency: CURRENCY_CODE,
      successUrl: dto.successUrl,
      cancelUrl: dto.cancelUrl,
    });

    return { checkoutUrl };
  }
}
