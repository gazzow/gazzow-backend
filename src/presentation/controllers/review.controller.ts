import type { NextFunction, Request, Response } from "express";
import type { ICreateReviewUseCase } from "../../application/interfaces/usecase/review/create-review.js";
import logger from "../../utils/logger.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";

export class ReviewController {
  constructor(private _createReviewUseCase: ICreateReviewUseCase) {}

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
}
