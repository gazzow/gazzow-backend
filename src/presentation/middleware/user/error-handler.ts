import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
    logger.error(`Error handler: ${err.stack}`);


    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        })
    }

    // Fallback for unexpected Error
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseMessages.InternalServerError
    })
};  