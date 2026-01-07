import type { IPayment } from "../../../../../domain/entities/payment.js";

export interface IAdminListPaymentsUseCase {
  execute(): Promise<IPayment[]>;
}