import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";

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
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    })
};  