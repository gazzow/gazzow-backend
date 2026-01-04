import type { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import { AppError } from "../../utils/app-error.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import type { IListTeamChatMessagesUseCase } from "../../application/interfaces/usecase/team-chat/list-messages.js";

export class TeamChatController {
  constructor(
    private _listTeamChatMessagesUseCase: IListTeamChatMessagesUseCase
  ) {}

  listTeamMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("List Team Messages API hit 🚀");
    const projectId = req.params.projectId;
    if (!projectId) {
      throw new AppError(
        ResponseMessages.ProjectIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );
    }
    try {
      const { data } = await this._listTeamChatMessagesUseCase.execute({
        projectId,
      });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedTeamChatMessages, data));
    } catch (error) {
      next(error);
    }
  };
}
