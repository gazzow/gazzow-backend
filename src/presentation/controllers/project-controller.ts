import type { NextFunction, Request, Response } from "express";

import type { ICreateProjectUseCase } from "../../application/interfaces/usecase/project/create-project.js";
import type { IListProjectUseCase } from "../../application/interfaces/usecase/project/list-projects.js";
import type { ICreateApplicationUseCase } from "../../application/interfaces/usecase/project/apply-project.js";

import { ApiResponse } from "../common/api-response.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";

import logger from "../../utils/logger.js";
import type { IListApplicationsUseCase } from "../../application/interfaces/usecase/project/list-applications.js";
import { AppError } from "../../utils/app-error.js";
import type { IListMyProjectsUsecase } from "../../application/interfaces/usecase/project/list-my-projects.js";
import type { IGetProjectUseCase } from "../../application/interfaces/usecase/project/get-project.js";

export class ProjectController {
  constructor(
    private _createProjectUseCase: ICreateProjectUseCase,
    private _getProjectUseCase: IGetProjectUseCase,
    private _listProjectUseCase: IListProjectUseCase,
    private _createApplicationUseCase: ICreateApplicationUseCase,
    private _listApplicationsUseCase: IListApplicationsUseCase,
    private _listMyProjectsUsecase: IListMyProjectsUsecase
  ) {}

  createProject = async (req: Request, res: Response, next: NextFunction) => {
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

  getProject = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Get Project API hit 🚀");

    try {
      const { projectId } = req.params;
      if (!projectId) {
        throw new AppError("Project id required", HttpStatusCode.BAD_REQUEST);
      }
      const { data } = await this._getProjectUseCase.execute({ projectId });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.ProjectRetrieved, data));
    } catch (error) {
      next(error);
    }
  };

  listProjects = async (req: Request, res: Response, next: NextFunction) => {
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

  createApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("Apply project API hit 🚀");

    try {
      const { projectId } = req.params;
      const userId = req.user!.id;
      logger.debug(`apply project request body: ${JSON.stringify(req.body)}`);

      const { data } = await this._createApplicationUseCase.execute({
        ...req.body,
        projectId,
        applicantId: userId,
      });
      res
        .status(HttpStatusCode.CREATED)
        .json(ApiResponse.success(ResponseMessages.ApplicationSubmitted, data));
    } catch (error) {
      next(error);
    }
  };

  listApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("List Application API hit 🚀");

    const projectId = req.params.projectId;
    if (!projectId) {
      throw new AppError("Project id required", HttpStatusCode.BAD_REQUEST);
    }
    try {
      const { data } = await this._listApplicationsUseCase.execute({
        projectId,
      });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedApplications, data));
    } catch (error) {
      next(error);
    }
  };

  listMyProjects = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("List Project By Creator Id API hit 🚀");
    const creatorId = req.user?.id;
    if (!creatorId) {
      throw new AppError("Creator id required", HttpStatusCode.BAD_REQUEST);
    }

    logger.debug(`My project api creatorId: ${creatorId}`);
    try {
      const { data } = await this._listMyProjectsUsecase.execute({ creatorId });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedProjects, data));
    } catch (error) {
      next(error);
    }
  };
}
