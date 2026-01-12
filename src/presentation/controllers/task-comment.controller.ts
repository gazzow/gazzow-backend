import type { NextFunction, Request, Response } from "express";
import type { ICreateTaskCommentUseCase } from "../../application/interfaces/usecase/task-comment/create-comment.js";
import logger from "../../utils/logger.js";
import type { ICreateTaskCommentRequestDTO } from "../../application/dtos/task-comment.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import type { IGetTaskCommentsUseCase } from "../../application/interfaces/usecase/task-comment/get-comments.js";
import { AppError } from "../../utils/app-error.js";

export class TaskCommentController {
  constructor(
    private _createTaskCommentUseCase: ICreateTaskCommentUseCase,
    private _getTaskCommentsUseCase: IGetTaskCommentsUseCase
  ) {}

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Create task Comment API hit 🚀");
    const userId = req.user!.id;

    try {
      const dto: ICreateTaskCommentRequestDTO = {
        ...req.body,
        userId,
      };
      const { data } = await this._createTaskCommentUseCase.execute(dto);
      res
        .status(HttpStatusCode.CREATED)
        .json(ApiResponse.success(ResponseMessages.TaskCommentCreated, data));
    } catch (error) {
      next(error);
    }
  };

  getComments = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Get task Comments API hit 🚀");
    const taskId = req.params.taskId;
    if (!taskId) {
      throw new AppError(
        ResponseMessages.TaskIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );
    }
    try {
      const { data } = await this._getTaskCommentsUseCase.execute({ taskId });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedTaskComments, data));
    } catch (error) {
      next(error);
    }
  };
}
