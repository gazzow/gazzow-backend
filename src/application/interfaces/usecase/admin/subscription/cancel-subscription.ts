import type { ICancelSubscriptionRequestDTO } from "../../../../dtos/admin/subscription.js";

export interface ICancelSubscriptionUseCase {
  execute(dto: ICancelSubscriptionRequestDTO): Promise<void>;
}
