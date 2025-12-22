import type { ITaskPaymentRequestDTO } from "../../../dtos/payment.js";

export interface ITaskPaymentUseCase {
  execute(dto: ITaskPaymentRequestDTO): Promise<void>;
}
