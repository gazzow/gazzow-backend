import type { IApplicationDocumentWithApplicant } from "../../../domain/entities/application.js";
import type { IApplicationDocument } from "../../../infrastructure/db/models/application-model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface IApplicationRepository
  extends IBaseRepository<IApplicationDocument> {
  findByProjectId(projectId: string): Promise<IApplicationDocumentWithApplicant[] | null>;
  findByApplicantAndProject(
    applicantId: string,
    projectId: string
  ): Promise<IApplicationDocument | null>;
}
