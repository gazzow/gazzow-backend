import type { NextFunction, Request, Response } from "express";
import type { IAdminDashboardStatsUseCase } from "../../../application/use-cases/admin/dashboard/dashboard-stats.js";
import logger from "../../../utils/logger.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../../common/api-response.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";

export class DashboardController {
  constructor(
    private _adminDashboardStatsUseCase: IAdminDashboardStatsUseCase
  ) {}

  dashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Admin Dashboard API hit 🚀");

    try {
      const data = await this._adminDashboardStatsUseCase.execute();
      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.success(ResponseMessages.AdminDashboardStatsFetched, data)
        );
    } catch (error) {
      next(error);
    }
  };
}
