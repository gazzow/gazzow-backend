import type { IPayment } from "../../../../../domain/entities/payment.js";

export interface IListPaymentsUseCase {
  execute(): Promise<IPayment[]>;
}