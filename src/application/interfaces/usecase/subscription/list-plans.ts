import type { IListSubscriptionPlansRequestDTO, IListSubscriptionPlansResponseDTO } from "../../../dtos/subscription.js";

export interface IListSubscriptionPlansUseCase {
  execute(dto: IListSubscriptionPlansRequestDTO): Promise<IListSubscriptionPlansResponseDTO>;
}
