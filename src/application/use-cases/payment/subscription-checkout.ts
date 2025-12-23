import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  ISubscriptionCheckoutRequestDTO,
  ISubscriptionCheckoutResponseDTO,
} from "../../dtos/payment.js";
import type { IPlanRepository } from "../../interfaces/repository/plan.repository.js";
import type { ISubscriptionRepository } from "../../interfaces/repository/subscription.repository.js";
import type { ISubscriptionCheckoutUseCase } from "../../interfaces/usecase/payment/subscription-checkout.js";
import type { IPlanMapper } from "../../mappers/admin/plan.js";
import type { IStripeService } from "../../providers/stripe-service.js";

export class SubscriptionCheckoutUseCase
  implements ISubscriptionCheckoutUseCase
{
  constructor(
    private _planRepository: IPlanRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _planMapper: IPlanMapper,
    private _paymentService: IStripeService
  ) {}

  async execute(
    dto: ISubscriptionCheckoutRequestDTO
  ): Promise<ISubscriptionCheckoutResponseDTO> {

    const activeSubscription = await this._subscriptionRepository.findByUserId(
      dto.userId
    );
    if (activeSubscription) {
      throw new AppError(
        ResponseMessages.UserAlreadySubscribed,
        HttpStatusCode.CONFLICT
      );
    }

    const planDoc = await this._planRepository.findById(dto.planId);
    if (!planDoc)
      throw new AppError(
        ResponseMessages.PlanNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const plan = this._planMapper.toDomain(planDoc);

    const CURRENCY_CODE = "usd";
    const AMOUNT_IN_CENTS = plan.price * 100;

    const checkoutUrl = await this._paymentService.subscriptionCheckout({
      userId: dto.userId,
      planId: plan.id,
      amountInCents: AMOUNT_IN_CENTS,
      currency: CURRENCY_CODE,
      successUrl: dto.successUrl,
      cancelUrl: dto.cancelUrl,
    });

    return { checkoutUrl };
  }
}
