import type { NextFunction, Request, Response } from "express";
import type { IAddProjectFavoriteUseCase } from "../../application/interfaces/usecase/favorite.ts/add-project.js";
import type { IListFavoriteProjectsUseCase } from "../../application/interfaces/usecase/favorite.ts/list-favorites.js";
import logger from "../../utils/logger.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import type { IRemoveFavoriteProjectUseCase } from "../../application/interfaces/usecase/favorite.ts/remove-favorite.js";

export class FavoriteController {
  constructor(
    private _addProjectFavoriteUseCase: IAddProjectFavoriteUseCase,
    private _listFavoriteUseCase: IListFavoriteProjectsUseCase,
    private _removeFavoriteUseCase: IRemoveFavoriteProjectUseCase
  ) {}

  addProject = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Add Favorite Project API hit 🚀");
    const userId = req.user!.id;
    const { projectId } = req.body;

    try {
      const data = await this._addProjectFavoriteUseCase.execute({
        userId,
        projectId,
      });

      res
        .status(HttpStatusCode.CREATED)
        .json(
          ApiResponse.success(ResponseMessages.ProjectMarkedAsFavorite, data)
        );
    } catch (error) {
      next(error);
    }
  };

  listFavorites = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("List Favorites API hit 🚀");
    const userId = req.user!.id;
    const limit = req.query.limit || 6;
    const skip = req.query.skip || 0;

    try {
      const { data, total } = await this._listFavoriteUseCase.execute({
        userId,
        limit: Number(limit),
        skip: Number(skip),
      });

      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.paginated(
            ResponseMessages.FetchedFavoriteProjects,
            data,
            { limit: Number(limit), skip: Number(skip), total }
          )
        );
    } catch (error) {
      next(error);
    }
  };

  removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Remove Favorites API hit 🚀");
    const userId = req.user!.id;
    const projectId = req.params.projectId!;

    try {
      await this._removeFavoriteUseCase.execute({
        userId,
        projectId,
      });

      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedFavoriteProjects));
    } catch (error) {
      next(error);
    }
  };
}
