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
import type { ISubscriptionMapper } from "../../mappers/subscription.js";
import type { IStripeService } from "../../providers/stripe-service.js";

export class SubscriptionCheckoutUseCase
  implements ISubscriptionCheckoutUseCase
{
  constructor(
    private _planRepository: IPlanRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _subscriptionMapper: ISubscriptionMapper,
    private _planMapper: IPlanMapper,
    private _paymentService: IStripeService,
  ) {}

  async execute(
    dto: ISubscriptionCheckoutRequestDTO,
  ): Promise<ISubscriptionCheckoutResponseDTO> {
    const subscriptionDocument =
      await this._subscriptionRepository.findByUserId(dto.userId);

    if (subscriptionDocument) {
      const currentSubscription =
        this._subscriptionMapper.toEntity(subscriptionDocument);
      console.log(currentSubscription);

      // Throw Error when user try to buy same plan again
      if (currentSubscription.id === dto.planId) {
        throw new AppError(
          ResponseMessages.UserAlreadySubscribed,
          HttpStatusCode.BAD_REQUEST,
        );
      }

      const { activePlan } = currentSubscription;

      const remainingDays = this.getRemainingDays(currentSubscription.endDate);

      const currentPlanDurationInDays = this.getPlanDurationInDays(
        currentSubscription.startDate,
        currentSubscription.endDate,
      );

      const currentPerDayCost = this.getPerDayCost(
        activePlan.price,
        currentPlanDurationInDays,
      );

      const remainingValue = remainingDays * currentPerDayCost;

      const planDoc = await this._planRepository.findById(dto.planId);

      if (!planDoc)
        throw new AppError(
          ResponseMessages.PlanNotFound,
          HttpStatusCode.NOT_FOUND,
        );

      const plan = this._planMapper.toDomain(planDoc);

      const payableAmount =
        Math.max(plan.price, remainingValue) -
        Math.min(plan.price, remainingValue);

      const CURRENCY_CODE = "usd";
      const AMOUNT_IN_CENTS = payableAmount * 100;

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

    const planDoc = await this._planRepository.findById(dto.planId);
    if (!planDoc)
      throw new AppError(
        ResponseMessages.PlanNotFound,
        HttpStatusCode.NOT_FOUND,
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

  private getRemainingDays(endDate: Date) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const now = new Date();
    return Math.max(
      0,
      Math.round((endDate.getTime() - now.getTime()) / MS_PER_DAY),
    );
  }

  private getPerDayCost(price: number, durationDays: number): number {
    return price / durationDays;
  }

  private getPlanDurationInDays(startDate: Date, endDate: Date): number {
    const start = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
      ),
    );

    const end = new Date(
      Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate(),
      ),
    );

    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
  }
}
