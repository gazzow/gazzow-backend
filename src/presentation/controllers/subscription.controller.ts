import type { NextFunction, Request, Response } from "express";
import type { IListSubscriptionPlansUseCase } from "../../application/interfaces/usecase/subscription/list-plans.js";
import logger from "../../utils/logger.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import { PlanDuration } from "../../domain/enums/plan.js";
import type { IListSubscriptionPlansRequestDTO } from "../../application/dtos/subscription.js";
import type { IGetSubscriptionUseCase } from "../../application/interfaces/usecase/subscription/get-subscription.js";

export class SubscriptionController {
  constructor(
    private _listSubscriptionPlansUseCase: IListSubscriptionPlansUseCase,
    private _getSubscriptionUseCase: IGetSubscriptionUseCase
  ) {}

  listPlans = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("List Plans API hit 🚀");

    const dto: IListSubscriptionPlansRequestDTO = {
      duration: req.query.duration as PlanDuration,
    };

    try {
      const { data } = await this._listSubscriptionPlansUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedPlans, data));
    } catch (error) {
      next(error);
    }
  };

  getSubscription = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Get subscription API hit 🚀");
    const userId = req.user!.id;

    try {
      const { data } = await this._getSubscriptionUseCase.execute({ userId });
      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.success(ResponseMessages.FetchUserSubscription, data)
        );
    } catch (error) {
      next(error);
    }
  };
}
