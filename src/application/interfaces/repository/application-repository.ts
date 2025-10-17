import type { IApplicationDocument } from "../../../infrastructure/db/models/application-model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface IApplicationRepository
  extends IBaseRepository<IApplicationDocument> {
  findByProjectId(projectId: string): Promise<IApplicationDocument[] | null>;
  findByUserAndProject(
    applicantId: string,
    projectId: string
  ): Promise<IApplicationDocument | null>;
}
