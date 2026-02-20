import type { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import { ApiResponse } from "../common/api-response.js";
import { mapZodErrorToErrorDetail } from "../mappers/zod-error.mapper.js";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res
        .status(400)
        .json(
          ApiResponse.validationError(mapZodErrorToErrorDetail(result.error)),
        );
    }

    req[target] = result.data;
    next();
  };
