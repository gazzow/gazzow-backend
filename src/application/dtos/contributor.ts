import type { IApplicationWithPopulatedProject } from "../../domain/entities/application.js";
import type { IContributor, IProject } from "../../domain/entities/project.js";
import type { ApplicationStatus } from "../../domain/enums/application.js";
import type { ContributorStatus } from "../../domain/enums/project.js";

export interface IListContributorProjectRequestDTO {
  userId: string;
  search?: string;
  budgetOrder?: "asc" | "desc";
  skip?: number;
  limit?: number;
}

export interface IListContributorProjectResponseDTO {
  data: IProject[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface IListContributorProposalsRequestDTO {
  userId: string;
  status: ApplicationStatus;
  sortBy?: string;
  sortOrder?: string;
  skip: number;
  limit: number;
}

export interface IListContributorProposalsResponseDTO {
  data: IApplicationWithPopulatedProject[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface IUpdateContributorStatusRequestDTO {
  contributorId: string;
  status: ContributorStatus;
  projectId: string;
}

export interface IUpdateContributorStatusResponseDTO {
  data: IProject;
}
