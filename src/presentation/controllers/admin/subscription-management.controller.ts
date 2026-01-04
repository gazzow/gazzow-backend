import type { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger.js";
import type { IListSubscriptionsUseCase } from "../../../application/interfaces/usecase/admin/subscription/list-subscriptions.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../../common/api-response.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import type { ICancelSubscriptionUseCase } from "../../../application/use-cases/admin/subscription/cancel-subscription.js";

export class SubscriptionManagementController {
  constructor(
    private _listSubscriptionUseCase: IListSubscriptionsUseCase,
    private _cancelSubscriptionUseCase: ICancelSubscriptionUseCase
  ) {}

  listSubscriptions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("List subscriptions API hit 🚀");

    try {
      const { data } = await this._listSubscriptionUseCase.execute({});
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedPlans, data));
    } catch (error) {
      next(error);
    }
  };

  cancelSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("Cancel subscriptions API hit 🚀");
    const subscriptionId = req.params.subscriptionId!;
    try {
      await this._cancelSubscriptionUseCase.execute({ subscriptionId });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.SubscriptionCancelled));
    } catch (error) {
      next(error);
    }
  };
}
