import type { NextFunction, Request, Response } from "express";
import type { ICreateTaskUseCase } from "../../application/interfaces/usecase/task/create-task.js";
import logger from "../../utils/logger.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import type { IListTasksByContributorUseCase } from "../../application/interfaces/usecase/task/list-tasks-by-contributor.js";
import type { IListTasksByCreatorUseCase } from "../../application/interfaces/usecase/task/list-tasks-by-creator.js";
import { AppError } from "../../utils/app-error.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import type { IUpdateTaskUseCase } from "../../application/interfaces/usecase/task/update-task.js";

export class TaskController {
  constructor(
    private _createTaskUseCase: ICreateTaskUseCase,
    private _listTasksByContributorUseCase: IListTasksByContributorUseCase,
    private _listTasksByCreatorUseCase: IListTasksByCreatorUseCase,
    private _updateTaskUseCase: IUpdateTaskUseCase
  ) {}

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Create task API hit 🚀");
    const userId = req.user!.id;
    const projectId = req.params.projectId;
    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );
    }

    try {
      await this._createTaskUseCase.execute({
        ...req.body,
        creatorId: userId,
        projectId,
      });
      res
        .status(HttpStatusCode.CREATED)
        .json(ApiResponse.success("Task created successfully"));
    } catch (error) {
      next(error);
    }
  };

  listTasksByContributor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("list task by contributor API hit 🚀");
    const userId = req.user!.id;
    const projectId = req.params.projectId;
    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );
    }

    try {
      const dto = { userId, projectId };
      const data = await this._listTasksByContributorUseCase.execute(dto);

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedTasks, data));
    } catch (error) {
      next(error);
    }
  };

  listTasksByCreator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("list task by Creator API hit 🚀");
    const userId = req.user!.id;
    const projectId = req.params.projectId;
    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );
    }

    try {
      const dto = { userId, projectId };
      const data = await this._listTasksByCreatorUseCase.execute(dto);

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedTasks, data));
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Update task by Creator API hit 🚀");
    const userId = req.user!.id;
    const taskId = req.params.taskId;
    if (!taskId) {
      throw new AppError(
        ResponseMessages.TaskIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );
    }

    try {
      const dto = { userId, taskId, data: req.body };
      logger.debug(`dto: ${JSON.stringify(dto)}`);
      const { data } = await this._updateTaskUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.TaskUpdateSuccess, data));
    } catch (error) {
      next(error);
    }
  };
}
