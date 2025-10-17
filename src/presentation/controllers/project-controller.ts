import type { NextFunction, Request, Response } from "express";

import type { ICreateProjectUseCase } from "../../application/interfaces/usecase/project/create-project.js";
import type { IListProjectUseCase } from "../../application/interfaces/usecase/project/list-projects.js";
import type { IApplyProjectUseCase } from "../../application/interfaces/usecase/project/apply-project.js";

import { ApiResponse } from "../common/api-response.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";

import logger from "../../utils/logger.js";

export class ProjectController {
  constructor(
    private _createProjectUseCase: ICreateProjectUseCase,
    private _listProjectUseCase: IListProjectUseCase,
    private _applyProjectUseCase: IApplyProjectUseCase
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

  applyProject = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Apply project API hit 🚀");

    try {
      const { projectId } = req.params;
      const userId = req.user!.id;
      logger.debug(`apply project request body: ${JSON.stringify(req.body)}`);

      const { data } = await this._applyProjectUseCase.execute({
        ...req.body,
        projectId,
        applicantId: userId,
      });
      res
        .status(HttpStatusCode.CREATED)
        .json(
          ApiResponse.success(
            ResponseMessages.ApplicationSubmitted,
            data
          )
        );
    } catch (error) {
      next(error);
    }
  };
}
