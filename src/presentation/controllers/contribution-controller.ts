import type { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger.js";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import { ApiResponse } from "../common/api-response.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import type { IListContributorProjectsUseCase } from "../../application/interfaces/usecase/project/list-contributor-projects.js";
import type { IListContributorProposalsUseCase } from "../../application/interfaces/usecase/project/list-contributor-proposals.js";
import { ApplicationStatus } from "../../domain/enums/application.js";
import type { IListContributorProposalsRequestDTO } from "../../application/dtos/contributor.js";

export class ContributorController {
  constructor(
    private _listContributorProjectsUseCase: IListContributorProjectsUseCase,
    private _listContributorProposalsUseCase: IListContributorProposalsUseCase
  ) {}

  getContributorProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("List Contributor Projects API hit 🚀");
    const userId = req.user!.id;
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 6;
    try {
      const payload = {
        ...req.query,
        skip,
        limit,
        userId,
      };
      const { data, pagination } =
        await this._listContributorProjectsUseCase.execute(payload);
      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.paginated(
            ResponseMessages.FetchedProjects,
            data,
            pagination
          )
        );
    } catch (error) {
      next(error);
    }
  };

  getContributorProposals = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.debug("List Contributor Proposals API hit 🚀");
    const userId = req.user!.id;

    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 6;

    const rawStatus = req.query.status as string | undefined;

    // Validate status input against enum
    const status: ApplicationStatus = Object.values(ApplicationStatus).includes(
      rawStatus as ApplicationStatus
    )
      ? (rawStatus as ApplicationStatus)
      : ApplicationStatus.PENDING;

    try {
      const payload: IListContributorProposalsRequestDTO = {
        status,
        skip,
        limit,
        userId,
      };
      const { data, pagination } =
        await this._listContributorProposalsUseCase.execute(payload);
      res
        .status(HttpStatusCode.OK)
        .json(
          ApiResponse.paginated(
            ResponseMessages.FetchedApplications,
            data,
            pagination
          )
        );
    } catch (error) {
      next(error);
    }
  };
}
