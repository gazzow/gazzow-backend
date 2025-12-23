import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { SubscriptionStatus } from "../../../domain/enums/subscription.js";
import { CalculateEndDate } from "../../../domain/policy/calculate-end-date.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  ICreateSubscriptionDTO,
  ICreateSubscriptionRequestDTO,
  ICreateSubscriptionResponseDTO,
} from "../../dtos/subscription.js";
import type { IPlanRepository } from "../../interfaces/repository/plan.repository.js";
import type { ISubscriptionRepository } from "../../interfaces/repository/subscription.repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { ISubscriptionPaymentUseCase } from "../../interfaces/usecase/subscription/subscription-payment.js";
import type { IPlanMapper } from "../../mappers/admin/plan.js";
import type { ISubscriptionMapper } from "../../mappers/subscription.js";

export class SubscriptionPaymentUseCase implements ISubscriptionPaymentUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _planRepository: IPlanRepository,
    private _planMapper: IPlanMapper,
    private _subscriptionMapper: ISubscriptionMapper
  ) {}

  async execute(
    dto: ICreateSubscriptionRequestDTO
  ): Promise<ICreateSubscriptionResponseDTO> {
    logger.info(`Processing payment for plan ID: ${dto.planId}`);

    const userExists = await this._userRepository.findById(dto.userId);
    if (!userExists)
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );

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
    if (!planDoc) {
      throw new AppError(
        ResponseMessages.PlanNotFound,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const plan = this._planMapper.toDomain(planDoc);

    const startDate = new Date();
    const endDate = CalculateEndDate(startDate, plan.duration);

    const payload: ICreateSubscriptionDTO = {
      userId: dto.userId,
      planId: plan.id,
      activePlan: {
        name: plan.name,
        type: plan.type,
        duration: plan.duration,
        price: plan.price,
        features: plan.features,
      },
      status: SubscriptionStatus.ACTIVE,
      startDate: startDate,
      endDate: endDate,
    };

    const persistentModel = this._subscriptionMapper.toPersistentModel(payload);

    const newSubscription =
      await this._subscriptionRepository.create(persistentModel);

    const data = this._subscriptionMapper.toResponseDTO(newSubscription);

    return { data };
  }
}
