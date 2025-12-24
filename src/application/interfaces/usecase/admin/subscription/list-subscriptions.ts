import type {
  IListSubscriptionsResponseDTO,
  IListSubscriptionsRequestDTO,
} from "../../../../dtos/admin/subscription.js";

export interface IListSubscriptionsUseCase {
  execute(
    dto: IListSubscriptionsRequestDTO
  ): Promise<IListSubscriptionsResponseDTO>;
}
