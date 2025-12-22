import type { IReleaseFundsRequestDTO } from "../../../dtos/payment.js";

export interface IReleaseFundsUseCase {
  execute(dto: IReleaseFundsRequestDTO): Promise<void>;
}
