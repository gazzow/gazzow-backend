import type {
  IListSubscriptionsResponseDTO,
} from "../../../../dtos/admin/subscription.js";

export interface IListSubscriptionsUseCase {
  execute(
  ): Promise<IListSubscriptionsResponseDTO>;
}
