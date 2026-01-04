import type { NextFunction, Request, Response } from "express";
import type { IAdminDashboardStatsUseCase } from "../../../application/use-cases/admin/dashboard/dashboard-stats.js";
import logger from "../../../utils/logger.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../../common/api-response.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import type { IDashboardMonthlyRevenueUseCase } from "../../../application/use-cases/admin/dashboard/monthly-revenue.js";
import type { IDashboardSubscriptionDistributionUseCase } from "../../../application/use-cases/admin/dashboard/subscription-distribution.js";

export class DashboardController {
  constructor(
    private _adminDashboardStatsUseCase: IAdminDashboardStatsUseCase,
    private _dashboardMonthlyRevenueUseCase: IDashboardMonthlyRevenueUseCase,
    private _subscriptionDistributionUseCase: IDashboardSubscriptionDistributionUseCase
  ) {}

  dashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Admin Dashboard API hit 🚀");

    try {
      const data = await this._adminDashboardStatsUseCase.execute();
      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.success(ResponseMessages.AdminDashboardDataFetched, data)
        );
    } catch (error) {
      next(error);
    }
  };

  monthlyRevenue = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Dashboard Monthly revenue API hit 🚀");

    try {
      const { data } = await this._dashboardMonthlyRevenueUseCase.execute();
      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.success(ResponseMessages.AdminDashboardDataFetched, data)
        );
    } catch (error) {
      next(error);
    }
  };

  subscriptionDistribution = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("Subscription Distribution API hit 🚀");

    try {
      const { data } = await this._subscriptionDistributionUseCase.execute();
      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.success(ResponseMessages.AdminDashboardDataFetched, data)
        );
    } catch (error) {
      next(error);
    }
  };
}
