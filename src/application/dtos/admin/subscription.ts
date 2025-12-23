import type { ISubscription } from "../../../domain/entities/subscription.js";

export interface IListSubscriptionsRequestDTO {
  userId?: string;
}

export interface IListSubscriptionsResponseDTO {
  data: ISubscription[];
}
