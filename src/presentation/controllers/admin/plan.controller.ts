import type { NextFunction, Request, Response } from "express";
import type { ICreatePlanUseCase } from "../../../application/interfaces/usecase/admin/plan/create-plan.js";
import logger from "../../../utils/logger.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../../common/api-response.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import type { IListPlanUseCase } from "../../../application/interfaces/usecase/admin/plan/list-plan.js";
import { AppError } from "../../../utils/app-error.js";
import type { IGetPlanUseCase } from "../../../application/interfaces/usecase/admin/plan/get-plan.js";
import type { IUpdatePlanUseCase } from "../../../application/interfaces/usecase/admin/plan/update-plan.js";
import type { IUpdatePlanStatusUseCase } from "../../../application/interfaces/usecase/admin/plan/update-status.js";

export class PlanController {
  constructor(
    private _createPlanUseCase: ICreatePlanUseCase,
    private _listPlanUseCase: IListPlanUseCase,
    private _getPlanUseCase: IGetPlanUseCase,
    private _updatePlanUseCase: IUpdatePlanUseCase,
    private _updatePlanStatusUseCase: IUpdatePlanStatusUseCase,
  ) {}

  createPlan = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Create Plan API hit 🚀");

    try {
      const { data } = await this._createPlanUseCase.execute(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(ApiResponse.success(ResponseMessages.PlanCreated, data));
    } catch (error) {
      next(error);
    }
  };

  listPlan = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("List Plan API hit 🚀");

    try {
      const { data } = await this._listPlanUseCase.execute();
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedPlans, data));
    } catch (error) {
      next(error);
    }
  };

  getPlan = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Get Plan API hit 🚀");
    const planId = req.params.planId;
    if (!planId) {
      throw new AppError(
        ResponseMessages.PlanIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    try {
      const { data } = await this._getPlanUseCase.execute({ planId });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.PlanRetrieved, data));
    } catch (error) {
      next(error);
    }
  };

  updatePlan = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Update Plan API hit 🚀");
    const planId = req.params.planId;

    if (!planId) {
      throw new AppError(
        ResponseMessages.PlanIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    try {
      const { data } = await this._updatePlanUseCase.execute({
        planId,
        data: req.body,
      });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.PlanUpdateSuccess, data));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Update Plan status API hit 🚀");
    const planId = req.params.planId;
    const { isActive } = req.body;

    if (!planId) {
      throw new AppError(
        ResponseMessages.PlanIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    console.log(isActive);
    try {
      const { data } = await this._updatePlanStatusUseCase.execute({
        planId,
        isActive: isActive,
      });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.PlanUpdateSuccess, data));
    } catch (error) {
      next(error);
    }
  };
}
