import type { NextFunction, Request, Response } from "express";
import type { IAdminListProjectsUseCase } from "../../../application/interfaces/usecase/admin/project/list-projects.js";
import logger from "../../../utils/logger.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../../common/api-response.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import type { IAdminGetProjectUseCase } from "../../../application/interfaces/usecase/admin/project/get-project.js";
import { AppError } from "../../../utils/app-error.js";

export class AdminProjectController {
  constructor(
    private _adminListProjectUseCase: IAdminListProjectsUseCase,
    private _adminGetProjectUseCase: IAdminGetProjectUseCase
  ) {}

  listProjects = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("List project API hit🚀");
    try {
      const { data, pagination } = await this._adminListProjectUseCase.execute(
        req.query
      );
      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.paginated(
            ResponseMessages.FetchedProjects,
            data,
            pagination
          )
        );
    } catch (error) {
      next(error);
    }
  };

  getProject = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("get project details API hit🚀");
    const { projectId } = req.params;
    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );
    }
    try {
      const { data } = await this._adminGetProjectUseCase.execute({
        projectId,
      });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.ProjectRetrieved, data));
    } catch (error) {
      next(error);
    }
  };
}
