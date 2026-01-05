import type { IPayment } from "../../../../domain/entities/payment.js";
import type { IPaymentRepository } from "../../../../infrastructure/repositories/payment.repository.js";
import type { IListPaymentsUseCase } from "../../../interfaces/usecase/admin/payment/list-payments.js";
import type { IPaymentMapper } from "../../../mappers/payment.js";

export class ListPaymentsUseCase implements IListPaymentsUseCase {
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
