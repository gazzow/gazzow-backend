import type { NextFunction, Request, Response } from "express";
import type { ICreateReviewUseCase } from "../../application/interfaces/usecase/review/create-review.js";
import logger from "../../utils/logger.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import type { IListReviewsUseCase } from "../../application/interfaces/usecase/review/list-reviews.js";

export class ReviewController {
  constructor(
    private _createReviewUseCase: ICreateReviewUseCase,
    private _listReviewsUseCase: IListReviewsUseCase,
  ) {}

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("Create Review API hit 🚀");
    const userId = req.user!.id;
    const { taskId, review, rating } = req.body;

    try {
      await this._createReviewUseCase.execute({
        userId,
        taskId,
        review,
        rating,
      });
      res
        .status(HttpStatusCode.CREATED)
        .json(ApiResponse.success(ResponseMessages.ReviewCreated));
    } catch (error) {
      next(error);
    }
  };

  listReviews = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("List Reviews API hit 🚀");
    const userId = req.user!.id;

    try {
      const { data } = await this._listReviewsUseCase.execute({ userId });
      res
        .status(HttpStatusCode.OK)
        .json(ApiResponse.success(ResponseMessages.FetchedReviews, data));
    } catch (error) {
      next(error);
    }
  };
}
