import {
  PaymentStatus,
  PaymentType,
  type IPayment,
} from "../../../domain/entities/payment.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { SubscriptionStatus } from "../../../domain/enums/subscription.js";
import { CalculateEndDate } from "../../../domain/policy/calculate-end-date.js";
import type { IPaymentRepository } from "../../../infrastructure/repositories/payment.repository.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  ICreateSubscriptionDTO,
  ICreateSubscriptionRequestDTO,
  ICreateSubscriptionResponseDTO,
  IUpdateSubscription,
} from "../../dtos/subscription.js";
import type { IPlanRepository } from "../../interfaces/repository/plan.repository.js";
import type { ISubscriptionRepository } from "../../interfaces/repository/subscription.repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { ISubscriptionPaymentUseCase } from "../../interfaces/usecase/subscription/subscription-payment.js";
import type { IPlanMapper } from "../../mappers/admin/plan.js";
import type { IPaymentMapper } from "../../mappers/payment.js";
import type { ISubscriptionMapper } from "../../mappers/subscription.js";

export class SubscriptionPaymentUseCase implements ISubscriptionPaymentUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _planRepository: IPlanRepository,
    private _planMapper: IPlanMapper,
    private _subscriptionMapper: ISubscriptionMapper,
    private _paymentRepository: IPaymentRepository,
    private _paymentMapper: IPaymentMapper,
  ) {}

  async execute(
    dto: ICreateSubscriptionRequestDTO,
  ): Promise<ICreateSubscriptionResponseDTO> {
    logger.info(`Processing payment for plan ID: ${dto.planId}`);

    const userExists = await this._userRepository.findById(dto.userId);
    if (!userExists)
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND,
      );

    const activeSubscriptionDocument =
      await this._subscriptionRepository.findByUserId(dto.userId);

    const planDoc = await this._planRepository.findById(dto.planId);
    if (!planDoc) {
      throw new AppError(
        ResponseMessages.PlanNotFound,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const plan = this._planMapper.toDomain(planDoc);

    const startDate = new Date();
    const endDate = CalculateEndDate(startDate, plan.duration);

    if (activeSubscriptionDocument) {
      const activeSubscription = this._subscriptionMapper.toEntity(
        activeSubscriptionDocument,
      );
      const update: IUpdateSubscription = {
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
        paymentId: dto.stripePaymentIntentId,
      };
      const persistentModel =
        this._subscriptionMapper.toUpdatePersistent(update);

      const updatedSubscription = await this._subscriptionRepository.update(
        activeSubscription.id,
        persistentModel,
      );

      if (!updatedSubscription) {
        throw new AppError(
          ResponseMessages.FailedToUpgradeSubscription,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
      }
      const data = this._subscriptionMapper.toResponseDTO(updatedSubscription);

      const persistentData: Partial<IPayment> = {
        userId: dto.userId,
        subscriptionId: data.id,
        stripePaymentIntentId: dto.stripePaymentIntentId,
        totalAmount: dto.amount,
        currency: dto.currency,
        type: PaymentType.SUBSCRIPTION,
        status: PaymentStatus.SUCCESS,
      };

      const persistentPayment =
        this._paymentMapper.toPersistentModel(persistentData);

      await this._paymentRepository.create(persistentPayment);

      return { data };
    } else {
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
        startDate: startDate,
        endDate: endDate,
        status: SubscriptionStatus.ACTIVE,
        paymentId: dto.stripePaymentIntentId,
      };
      const persistentModel =
        this._subscriptionMapper.toPersistentModel(payload);

      const newSubscription =
        await this._subscriptionRepository.create(persistentModel);

      const data = this._subscriptionMapper.toResponseDTO(newSubscription);
      const persistentData: Partial<IPayment> = {
        userId: dto.userId,
        subscriptionId: data.id,
        stripePaymentIntentId: dto.stripePaymentIntentId,
        totalAmount: dto.amount,
        currency: dto.currency,
        type: PaymentType.SUBSCRIPTION,
        status: PaymentStatus.SUCCESS,
      };

      const persistentPayment =
        this._paymentMapper.toPersistentModel(persistentData);

      await this._paymentRepository.create(persistentPayment);

      return { data };
    }
  }
}
