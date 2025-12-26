import type { NextFunction, Request, Response } from "express";
import type { ICreateProjectUseCase } from "../../application/interfaces/usecase/project/create-project.js";
import type { IListProjectUseCase } from "../../application/interfaces/usecase/project/list-projects.js";
import type { ICreateApplicationUseCase } from "../../application/interfaces/usecase/project/create-application.js";

import { ApiResponse } from "../common/api-response.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";

import logger from "../../utils/logger.js";
import type { IListApplicationsUseCase } from "../../application/interfaces/usecase/project/list-applications.js";
import { AppError } from "../../utils/app-error.js";
import type { IListMyProjectsUsecase } from "../../application/interfaces/usecase/project/list-my-projects.js";
import type { IGetProjectUseCase } from "../../application/interfaces/usecase/project/get-project.js";
import type { IUpdateApplicationStatusUseCase } from "../../application/interfaces/usecase/project/update-application-status.js";
import type { IUpdateProjectUseCase } from "../../application/interfaces/usecase/project/update-project.js";
import type { IGenerateSignedUrlUseCase } from "../../application/interfaces/usecase/project/generate-signed-url.js";
import type { IListContributorsUseCase } from "../../application/interfaces/usecase/project/list-contributors.js";
import type { IUpdateContributorStatusUseCase } from "../../application/use-cases/project/update-contributor-status.js";

export class ProjectController {
  constructor(
    private _createProjectUseCase: ICreateProjectUseCase,
    private _getProjectUseCase: IGetProjectUseCase,
    private _updateProjectUseCase: IUpdateProjectUseCase,
    private _listProjectUseCase: IListProjectUseCase,
    private _createApplicationUseCase: ICreateApplicationUseCase,
    private _listApplicationsUseCase: IListApplicationsUseCase,
    private _listMyProjectsUseCase: IListMyProjectsUsecase,
    private _updateApplicationStatusUseCase: IUpdateApplicationStatusUseCase,
    private _generateSignedUrlUseCase: IGenerateSignedUrlUseCase,
    private _listContributorsUseCase: IListContributorsUseCase,
    private _updateContributorStatusUseCase: IUpdateContributorStatusUseCase
  ) {}

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("create project API hit🚀");
    const userId = req.user!.id;

    logger.debug(`files: ${req.files}`);
    const dto = { ...req.body, creatorId: userId, files: req.files };
    try {
      const { data } = await this._createProjectUseCase.execute(dto);
      res
        .status(HttpStatusCode.CREATED)
        .json(ApiResponse.success(ResponseMessages.ProjectCreated, data));
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

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Update Project API Hit 🚀");

    try {
      const userId = req.user!.id;
      const projectId = req.params.projectId;
      if (!projectId) {
        throw new AppError(
          "Project ID is required",
          HttpStatusCode.BAD_REQUEST
        );
      }
      logger.warn(`req body [update project]: ${JSON.stringify(req.body)}`);

      const { data } = await this._updateProjectUseCase.execute({
        projectId,
        userId,
        data: req.body,
      });

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.ProjectUpdateSuccess, data));
    } catch (error) {
      next(error);
    }
  };

  listProjects = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("List Project API hit 🚀");
    const userId = req.user!.id;
    const skip = parseInt(req.query.skip as string);
    const limit = parseInt(req.query.limit as string);

    const payload = {
      ...req.query,
      skip,
      limit,
      userId,
    };
    try {
      const { data, pagination } =
        await this._listProjectUseCase.execute(payload);
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

  generateSignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("Generate Signed url API hit 🚀");
    const fileKey = req.query.fileKey as string;

    if (!fileKey) throw new AppError("File key is missing");

    try {
      const signedUrl = await this._generateSignedUrlUseCase.execute(fileKey);
      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.success(ResponseMessages.GeneratedSignedUrl, signedUrl)
        );
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
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 6;

      const payload = {
        ...req.query,
        skip,
        limit,
        creatorId,
      };

      const { data, pagination } =
        await this._listMyProjectsUseCase.execute(payload);
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

  updateApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("Update Application Status API hit 🚀");
    const { status } = req.body;
    logger.debug(`req.body status: ${status}`);

    const { projectId, applicationId } = req.params;
    if (!projectId) {
      throw new AppError("Project id required", HttpStatusCode.BAD_REQUEST);
    }
    if (!applicationId) {
      throw new AppError("application id required", HttpStatusCode.BAD_REQUEST);
    }

    try {
      await this._updateApplicationStatusUseCase.execute({
        applicationId,
        projectId,
        status,
      });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.ApplicationStatusUpdated));
    } catch (error) {
      next(error);
    }
  };

  listContributors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("List contributors API hit 🚀");
    const { projectId } = req.params;
    logger.debug(projectId);
    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );
    }
    try {
      const data = await this._listContributorsUseCase.execute({ projectId });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedContributors, data));
    } catch (error) {
      next(error);
    }
  };

  updateContributorStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("Update Contributor Status API hit 🚀");

    const { projectId } = req.params;
    const { contributorId, status } = req.body;

    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const dto = {
      projectId,
      contributorId,
      status,
    };

    try {
      const { data } = await this._updateContributorStatusUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.ContributorStatusUpdated));
    } catch (error) {
      next(error);
    }
  };
}
