import {
  PaymentRepository,
  type IPaymentRepository,
} from "../../repositories/payment.repository.js";

import {
  PaymentMapper,
  type IPaymentMapper,
} from "../../../application/mappers/payment.js";
import { PaymentModel } from "../../db/models/payment.model.js";
import type { IListPaymentsUseCase } from "../../../application/interfaces/usecase/admin/payment/list-payments.js";
import { ListPaymentsUseCase } from "../../../application/use-cases/admin/payment/list-payments.js";
import { AdminPaymentController } from "../../../presentation/controllers/admin/payment.controller.js";

export class AdminPaymentContainer {
  private readonly _paymentRepository: IPaymentRepository;
  private readonly _paymentMapper: IPaymentMapper;

  constructor() {
    this._paymentRepository = new PaymentRepository(PaymentModel);
    this._paymentMapper = new PaymentMapper();
  }

  private createListPaymentsUseCase(): IListPaymentsUseCase {
    return new ListPaymentsUseCase(
      this._paymentRepository,
      this._paymentMapper
    );
  }

  // Payment Controller
  createPaymentController(): AdminPaymentController {
    return new AdminPaymentController(this.createListPaymentsUseCase());
  }
}
