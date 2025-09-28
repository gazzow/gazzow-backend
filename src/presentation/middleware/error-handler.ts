import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/app-error.js";
import logger from "../../utils/logger.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import { ApiResponse } from "../common/api-response.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`Error handler: ${err.stack}`);

  if (err instanceof AppError) {
    logger.warn('app error')
    return res.status(err.statusCode).json(ApiResponse.error(err.message));
  }
  
  logger.warn('Internal error')
  // Fallback for unexpected Error
  return res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json(ApiResponse.error(ResponseMessages.InternalServerError));
};
