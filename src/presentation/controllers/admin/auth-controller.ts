import type { Request, Response } from "express";
import logger from "../../../utils/logger.js";
import { env } from "../../../infrastructure/config/env.js";
import type { IAdminLoginUseCase } from "../../../application/interfaces/admin/auth/login.js";

export class AdminAuthController {
  constructor(private adminLoginUseCase: IAdminLoginUseCase) {}

  login = async (req: Request, res: Response) => {
    logger.debug("Admin login api hit🚀");

    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken, ...result } =
        await this.adminLoginUseCase.execute(email, password);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: env.jwt.access_expires, // 15 minutes
        sameSite: "strict",
        secure: env.node_env,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: env.jwt.refresh_expires, // 7 days
        sameSite: "strict",
        secure: env.node_env,
      });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`error admin login: ${error.message}`);
        return res.status(400).json({ success: false, message: error.message });
      }
    }
  };
}
