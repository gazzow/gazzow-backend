import type {
  ICreateTaskCheckoutSessionRequestDTO,
  ICreateTaskCheckoutSessionResponseDTO,
} from "../../../dtos/payment.js";

export interface ITaskCheckoutSessionUseCase {
  execute(
    dto: ICreateTaskCheckoutSessionRequestDTO
  ): Promise<ICreateTaskCheckoutSessionResponseDTO>;
}
