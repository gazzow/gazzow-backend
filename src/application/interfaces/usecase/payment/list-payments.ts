import type { IListPaymentsRequestDTO, IListPaymentsResponseDTO } from "../../../dtos/payment.js";

export interface IListPaymentsUseCase {
  execute(dto: IListPaymentsRequestDTO): Promise<IListPaymentsResponseDTO>;
}
