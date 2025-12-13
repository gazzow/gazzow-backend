import type { ICreateConnectedAccountRequestDTO } from "../../../dtos/payment.js";

export interface ICreateConnectedAccountUseCase {
  execute(dto: ICreateConnectedAccountRequestDTO): Promise<void>;
}
