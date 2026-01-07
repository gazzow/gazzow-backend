import type { IPaymentRepository } from "../../../infrastructure/repositories/payment.repository.js";
import type {
  IListPaymentsRequestDTO,
  IListPaymentsResponseDTO,
} from "../../dtos/payment.js";
import type { IListPaymentsUseCase } from "../../interfaces/usecase/payment/list-payments.js";
import type { IPaymentMapper } from "../../mappers/payment.js";

export class ListPaymentsUseCase implements IListPaymentsUseCase {
  constructor(
    private _paymentRepository: IPaymentRepository,
    private _paymentMapper: IPaymentMapper
  ) {}

  async execute(
    dto: IListPaymentsRequestDTO
  ): Promise<IListPaymentsResponseDTO> {
    const paymentDocs = await this._paymentRepository.findByUser(dto.userId);
    const data = paymentDocs.map((payments) =>
      this._paymentMapper.toResponseDTO(payments)
    );

    return { data };
  }
}
