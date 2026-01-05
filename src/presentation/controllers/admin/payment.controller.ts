import type { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../../common/api-response.js";
import type { IListPaymentsUseCase } from "../../../application/interfaces/usecase/admin/payment/list-payments.js";

export class AdminPaymentController {
  constructor(private _listPaymentsUseCase: IListPaymentsUseCase) {}

  listPayments = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("List Payments API hit 🚀");

    try {
      const data = await this._listPaymentsUseCase.execute();
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success("List payments successfully", data));
    } catch (error) {
      next(error);
    }
  };
}
