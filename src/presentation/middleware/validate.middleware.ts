import type { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import { ApiResponse } from "../common/api-response.js";
import logger from "../../utils/logger.js";
import { mapZodErrorToErrorDetail } from "../mappers/zod-error.mapper.js";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log("❌Validation failed❌");
      logger.debug(result.error);

      return res
        .status(400)
        .json(
          ApiResponse.validationError(mapZodErrorToErrorDetail(result.error)),
        );
    }

    req.body = result.data;
    next();
  };
