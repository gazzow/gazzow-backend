import type { IPayment } from "../../../../domain/entities/payment.js";
import type { IPaymentRepository } from "../../../../infrastructure/repositories/payment.repository.js";
import type { IPaymentMapper } from "../../../mappers/payment.js";

export interface IListPaymentsUseCase {
  execute(): Promise<IPayment[]>;
}

export class ListPaymentUseCase implements IListPaymentsUseCase {
  constructor(
    private _paymentRepository: IPaymentRepository,
    private _paymentMapper: IPaymentMapper
  ) {}
  async execute(): Promise<IPayment[]> {
    const paymentDocs = await this._paymentRepository.findAll({});
    const data = paymentDocs.map((pay) =>
      this._paymentMapper.toResponseDTO(pay)
    );

    return data;
  }
}
