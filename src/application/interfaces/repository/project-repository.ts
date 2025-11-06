import type { ContributorStatus } from "../../../domain/enums/project.js";
import type { IProjectDocument, IProjectDocumentPopulated } from "../../../infrastructure/db/models/project-model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface IProjectRepository extends IBaseRepository<IProjectDocument> {
  findByCreator(creatorId: string): Promise<IProjectDocument[] | null>;
  addContributor(
    projectId: string,
    userId: string,
    expectedRate: number,
    status: ContributorStatus
  ): Promise<IProjectDocument | null>;
  findContributors(projectId: string): Promise<IProjectDocumentPopulated | null>;
}
