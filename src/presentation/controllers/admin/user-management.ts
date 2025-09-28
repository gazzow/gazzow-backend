import type { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger.js";
import type { IListUsersUseCase } from "../../../application/interfaces/admin/users-management/list-users.js";
import type { IBlockUserUseCase } from "../../../application/interfaces/admin/users-management/block-user.js";
import type { IGetUserUseCase } from "../../../application/interfaces/admin/users-management/get-user.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { ApiResponse } from "../../common/api-response.js";

export class UserManagementController {
  constructor(
    private _listUserUseCase: IListUsersUseCase,
    private _blockUserUseCase: IBlockUserUseCase,
    private _getUserUseCase: IGetUserUseCase
  ) {}

  listUsers = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("admin user management list all users api 🚀");
    try {
      const { skip, limit } = req.query;

      const { data, pagination } = await this._listUserUseCase.execute({
        skip: Number(skip),
        limit: Number(limit),
      });
      logger.info(`response result: ${data}`);

      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.paginated(ResponseMessages.FetchedUsers, data, pagination)
        );
    } catch (error) {
      next(error);
    }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("User block api hit 🚀");

    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError(
          ResponseMessages.BadRequest,
          HttpStatusCode.BAD_REQUEST
        );
      }
      const { status } = req.body;

      logger.debug(`User id: ${id} & update status ->:${status} `);

      const { data } = await this._blockUserUseCase.execute(id, status);

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.UserStatusUpdated, data));
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("admin get user api 🚀");
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError(
          ResponseMessages.BadRequest,
          HttpStatusCode.BAD_REQUEST
        );
      }
      logger.debug(`user id: ${id}`);

      const {data} = await this._getUserUseCase.execute(id);

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.UserRetrieved, data));
    } catch (error) {
      next(error);
    }
  };
}
