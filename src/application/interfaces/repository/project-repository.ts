import type { ContributorStatus } from "../../../domain/enums/project.js";
import type {
  IProjectDocument,
  IProjectDocumentPopulated,
} from "../../../infrastructure/db/models/project-model.js";
import type { IBaseRepository } from "./base-repository.js";

export type FindWithFilter = {
  projects: IProjectDocument[];
  total: number;
};

export interface IProjectRepository extends IBaseRepository<IProjectDocument> {
  findWithFilter(query: {
    userId: string;
    search?: string;
    experience?: string;
    budgetOrder?: "asc" | "desc";
    skip?: number;
    limit?: number;
  }): Promise<FindWithFilter>;

  findByCreatorWithFilter(query: {
    creatorId: string;
    search?: string;
    status?: string;
    budgetOrder?: "asc" | "desc";
    skip?: number;
    limit?: number;
  }): Promise<FindWithFilter>;

  addContributor(
    projectId: string,
    userId: string,
    expectedRate: number,
    status: ContributorStatus
  ): Promise<IProjectDocument | null>;

  findContributors(
    projectId: string
  ): Promise<IProjectDocumentPopulated | null>;

  findActiveProjects(query: {
    userId: string;
    search?: string;
    budgetOrder?: "asc" | "desc";
    skip?: number;
    limit?: number;
  }): Promise<FindWithFilter>;
}
