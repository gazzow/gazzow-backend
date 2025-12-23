import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import type {
  IListSubscriptionsRequestDTO,
  IListSubscriptionsResponseDTO,
} from "../../../dtos/admin/subscription.js";
import type { ISubscriptionRepository } from "../../../interfaces/repository/subscription.repository.js";
import type { IListSubscriptionsUseCase } from "../../../interfaces/usecase/admin/subscription/list-subscriptions.js";
import type { ISubscriptionMapper } from "../../../mappers/subscription.js";

export class ListSubscriptionsUseCase implements IListSubscriptionsUseCase {
  constructor(
    private _subscriptionRepository: ISubscriptionRepository,
    private _subscriptionMapper: ISubscriptionMapper
  ) {}
  async execute(
    dto: IListSubscriptionsRequestDTO
  ): Promise<IListSubscriptionsResponseDTO> {
    const subscriptionDocs = await this._subscriptionRepository.findAll({});

    if (!subscriptionDocs) {
      throw new AppError(
        ResponseMessages.SubscriptionNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const subscriptions = subscriptionDocs.map((subscription) =>
      this._subscriptionMapper.toResponseDTO(subscription)
    );

    return { data: subscriptions };
  }
}
