import {
  PaymentRepository,
  type IPaymentRepository,
} from "../../repositories/payment.repository.js";

import {
  PaymentMapper,
  type IPaymentMapper,
} from "../../../application/mappers/payment.js";
import { PaymentModel } from "../../db/models/payment.model.js";
import type { IAdminListPaymentsUseCase } from "../../../application/interfaces/usecase/admin/payment/list-payments.js";
import { AdminListPaymentsUseCase } from "../../../application/use-cases/admin/payment/list-payments.js";
import { AdminPaymentController } from "../../../presentation/controllers/admin/payment.controller.js";

export class AdminPaymentContainer {
  private readonly _paymentRepository: IPaymentRepository;
  private readonly _paymentMapper: IPaymentMapper;

  constructor() {
    this._paymentRepository = new PaymentRepository(PaymentModel);
    this._paymentMapper = new PaymentMapper();
  }

  private createListPaymentsUseCase(): IAdminListPaymentsUseCase {
    return new AdminListPaymentsUseCase(
      this._paymentRepository,
      this._paymentMapper
    );
  }

  // Payment Controller
  createPaymentController(): AdminPaymentController {
    return new AdminPaymentController(this.createListPaymentsUseCase());
  }
}
