import type { NextFunction, Request, Response } from "express";
import { loginSchema } from "../../../../application/validators/admin/auth.schema.js";
import logger from "../../../../utils/logger.js";
import z from "zod";

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug("admin login validate middleware got hit🚀");
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credential Format",
        errors: error.issues,
      });
    }

    // fallback if some other error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
