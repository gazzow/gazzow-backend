import type { NextFunction, Request, Response } from "express";
import type { ICreateProjectUseCase } from "../../application/interfaces/usecase/project/create-project.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import logger from "../../utils/logger.js";
import type { IListProjectUseCase } from "../../application/interfaces/usecase/project/list-projects.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";

export class ProjectController {
  constructor(
    private _createProjectUseCase: ICreateProjectUseCase,
    private _listProjectUseCase: IListProjectUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("create project API hit🚀");
    try {
      const { data } = await this._createProjectUseCase.execute(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(ApiResponse.success("project created", data));
    } catch (error) {
      next(error);
    }
  };

  listAll = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("List Project API hit 🚀");
    try {
      const { data } = await this._listProjectUseCase.execute();
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedProjects, data));
    } catch (error) {
      next(error);
    }
  };
}
