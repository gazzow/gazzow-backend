import type { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger.js";
import type { IListUsersUseCase } from "../../../application/interfaces/admin/users-management/list-users.js";
import type { IBlockUserUseCase } from "../../../application/interfaces/admin/users-management/block-user.js";
import type { IGetUserUseCase } from "../../../application/interfaces/admin/users-management/get-user.js";

export class UserManagementController {
  constructor(
    private listUserUseCase: IListUsersUseCase,
    private blockUserUseCase: IBlockUserUseCase,
    private getUserUseCase: IGetUserUseCase
  ) {}

  listUsers = async (req: Request, res: Response) => {
    logger.debug("admin user management list all users api 🚀");
    try {
      const { skip, limit } = req.query;

      const result = await this.listUserUseCase.execute({
        skip: Number(skip),
        limit: Number(limit),
      });
      logger.info(`response result: ${result}`);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("User block api hit 🚀");

    try {
      const { id } = req.params;
      if (!id) {
        throw new Error("Invalid UserId");
      }
      const { status } = req.body;

      logger.debug(`User id: ${id} & update status ->:${status} `);

      const result = await this.blockUserUseCase.execute(id, status);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  };

  getUser = async (req: Request, res: Response) => {
    logger.debug("admin get user api 🚀");
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error("Invalid UserId");
      }
      logger.debug(`user id: ${id}`);

      const result = await this.getUserUseCase.execute(id);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };
}
