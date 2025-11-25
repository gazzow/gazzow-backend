import type { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import type { IListContributorProjectsUseCase } from "../../application/interfaces/usecase/project/list-contributor-projects.js";

export class ContributorController {
  constructor(
    private _listContributorProjectsUseCase: IListContributorProjectsUseCase
  ) {}

  getContributorProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("List Contributor Projects API hit 🚀");
    const userId = req.user!.id;
    const skip = parseInt(req.query.skip as string);
    const limit = parseInt(req.query.limit as string);
    try {
      const payload = {
        ...req.query,
        skip,
        limit,
        userId,
      };
      const { data, pagination } =
        await this._listContributorProjectsUseCase.execute(payload);
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
}
