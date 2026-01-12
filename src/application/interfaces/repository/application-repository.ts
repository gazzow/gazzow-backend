import type { IApplicationDocumentWithApplicant } from "../../../domain/entities/application.js";
import type { ApplicationStatus } from "../../../domain/enums/application.js";
import type {
  IApplicationDocument,
  IApplicationPopulatedProjectDocument,
} from "../../../infrastructure/db/models/application-model.js";
import type { IBaseRepository } from "./base-repository.js";

export type ApplicationPopulatedQuery = {
  userId: string;
  status: ApplicationStatus;
  sortBy?: string;
  sortOrder?: string;
  skip: number;
  limit: number;
};

export type FindWithPagination = {
  applications: IApplicationPopulatedProjectDocument[];
  total: number;
};

export interface IApplicationRepository
  extends IBaseRepository<IApplicationDocument> {
  findByProjectId(
    projectId: string
  ): Promise<IApplicationDocumentWithApplicant[] | null>;
  findByApplicantAndProject(
    applicantId: string,
    projectId: string
  ): Promise<IApplicationDocument | null>;
  updateStatus(
    applicationId: string,
    status: ApplicationStatus
  ): Promise<IApplicationDocument | null>;
  findApplicationsWithPopulatedProject(
    query: ApplicationPopulatedQuery
  ): Promise<FindWithPagination>;
}
