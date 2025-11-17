import type { NextFunction, Request, Response } from "express";
import type { IAdminListProjectsUseCase } from "../../../application/interfaces/usecase/admin/project/list-projects.js";
import logger from "../../../utils/logger.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../../common/api-response.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";

export class AdminProjectController {
  constructor(private _adminListProjectUseCase: IAdminListProjectsUseCase) {}

  listProjects = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("List project API hit🚀");
    try {
      const { data } = await this._adminListProjectUseCase.execute();
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedProjects, data));
    } catch (error) {
      next(error);
    }
  };
}
