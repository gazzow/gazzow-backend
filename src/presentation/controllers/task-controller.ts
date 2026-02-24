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
import type { IGetTaskUseCase } from "../../application/interfaces/usecase/task/get-task.js";
import type { IStartWorkUseCase } from "../../application/interfaces/usecase/task/start-task.js";
import type { ISubmitTaskUseCase } from "../../application/interfaces/usecase/task/submit-task.js";
import type { ICompleteTaskUseCase } from "../../application/interfaces/usecase/task/complete-task.js";
import type { IReassignTaskUseCase } from "../../application/interfaces/usecase/task/reassign-task.js";
import type { ICreateTaskRequestDTO } from "../../application/dtos/task.js";
import type { IRemoveAssigneeUseCase } from "../../application/interfaces/usecase/task/remove-assignee.js";

export class TaskController {
  constructor(
    private _createTaskUseCase: ICreateTaskUseCase,
    private _listTasksByContributorUseCase: IListTasksByContributorUseCase,
    private _listTasksByCreatorUseCase: IListTasksByCreatorUseCase,
    private _updateTaskUseCase: IUpdateTaskUseCase,
    private _getTaskUseCase: IGetTaskUseCase,
    private _startWorkUseCase: IStartWorkUseCase,
    private _submitTaskUseCase: ISubmitTaskUseCase,
    private _completeTaskUseCase: ICompleteTaskUseCase,
    private _reassignTaskUseCase: IReassignTaskUseCase,
    private _removeAssigneeUseCase: IRemoveAssigneeUseCase,
  ) {}

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Create task API hit 🚀");
    const userId = req.user!.id;
    const projectId = req.params.projectId;
    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    try {
      const dto: ICreateTaskRequestDTO = {
        ...req.body,
        creatorId: userId,
        projectId,
        files: req.files,
      };
      const { data } = await this._createTaskUseCase.execute(dto);
      res
        .status(HttpStatusCode.CREATED)
        .json(ApiResponse.success(ResponseMessages.TaskCreated, data));
    } catch (error) {
      next(error);
    }
  };

  listTasksByContributor = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    logger.debug("list task by contributor API hit 🚀");
    const userId = req.user!.id;
    const projectId = req.params.projectId;
    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
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
    next: NextFunction,
  ) => {
    logger.debug("list task by Creator API hit 🚀");
    const userId = req.user!.id;
    const projectId = req.params.projectId;
    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
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
        HttpStatusCode.BAD_REQUEST,
      );
    }

    try {
      const dto = { userId, taskId, data: req.body };
      const { data } = await this._updateTaskUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.TaskUpdateSuccess, data));
    } catch (error) {
      next(error);
    }
  };

  getTask = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Get task API hit 🚀");
    const userId = req.user!.id;
    const taskId = req.params.taskId;

    if (!taskId) {
      throw new AppError(
        ResponseMessages.TaskIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    try {
      const dto = { userId, taskId };
      const { data } = await this._getTaskUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.TaskRetrieved, data));
    } catch (error) {
      next(error);
    }
  };

  startWork = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Start work on task API hit 🚀");

    const taskId = req.params.taskId;
    const time = req.body.time || new Date();

    if (!taskId) {
      throw new AppError(
        ResponseMessages.TaskIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    try {
      const dto = { taskId, time };
      await this._startWorkUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.TaskUpdateSuccess));
    } catch (error) {
      next(error);
    }
  };

  submitTask = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Submit task API hit 🚀");
    const taskId = req.params.taskId;
    const time = req.body.time || new Date();
    if (!taskId) {
      throw new AppError(
        ResponseMessages.TaskIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    try {
      const dto = { taskId, time };
      await this._submitTaskUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.TaskUpdateSuccess));
    } catch (error) {
      next(error);
    }
  };

  completeTask = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Complete task API hit 🚀");
    const taskId = req.params.taskId;
    const time = req.body.time || new Date();
    if (!taskId) {
      throw new AppError(
        ResponseMessages.TaskIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    try {
      const dto = { taskId, time };
      await this._completeTaskUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.TaskUpdateSuccess));
    } catch (error) {
      next(error);
    }
  };

  reassignTask = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Reassign task API hit 🚀");
    const taskId = req.params.taskId;
    const userId = req.user!.id;
    if (!taskId) {
      throw new AppError(
        ResponseMessages.TaskIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const { assigneeId } = req.body;

    try {
      const dto = { taskId, assigneeId, userId };

      await this._reassignTaskUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.TaskReassigned));
    } catch (error) {
      next(error);
    }
  };

  removeAssignee = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Remove assignee task API hit 🚀");
    const taskId = req.params.taskId;
    const userId = req.user!.id;
    if (!taskId) {
      throw new AppError(
        ResponseMessages.TaskIdIsRequired,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    try {
      const dto = { taskId, userId };

      const { data } = await this._removeAssigneeUseCase.execute(dto);
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.AssigneeRemoved, data));
    } catch (error) {
      next(error);
    }
  };
}
