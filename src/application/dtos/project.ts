import type {
  IAggregatedProject,
  IProject,
} from "../../domain/entities/project.js";
import type { Express } from "express";
import type {
  ContributorStatus,
  ProjectDurationUnit,
  ProjectExperience,
  ProjectStatus,
  ProjectVisibility,
} from "../../domain/enums/project.js";
import type { IProjectFile } from "../interfaces/s3-bucket/file-storage.js";

export interface ICreateProjectRequestDTO {
  title: string;
  creatorId: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  requiredSkills: string[];
  experience: ProjectExperience;
  developersNeeded: number;
  durationMin: number;
  durationMax: number;
  durationUnit: ProjectDurationUnit;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  files?: Express.Multer.File[];
  documents: IProjectFile[];
}

export interface ICreateProjectResponseDTO {
  data: IProject;
}

export interface IListProjectRequestDTO {
  userId: string;
  search?: string;
  experience?: string;
  budgetOrder?: "asc" | "desc";
  skip?: number;
  limit?: number;
}

export interface IListProjectResponseDTO {
  data: IAggregatedProject[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface IListMyProjectRequestDTO {
  creatorId: string;
  search?: string;
  status?: string;
  budgetOrder?: "asc" | "desc";
  skip?: number;
  limit?: number;
}

export interface IListMyProjectsResponseDTO {
  data: IProject[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface IGetProjectRequestDTO {
  projectId: string;
}

export interface IGetProjectResponseDTO {
  data: IProject;
}

export interface IUpdateProjectRequestDTO {
  projectId: string;
  userId: string;
  data: Partial<IProject>;
}

export interface IUpdateProjectResponseDTO {
  data: IProject;
}

export interface IListContributorsRequestDTO {
  projectId: string;
}

export interface IListContributorsResponseDTO {
  projectId: string;
  title: string;
  contributors: {
    userId: string;
    name: string;
    email: string;
    imageUrl: string;
    developerRole: string;
    status: ContributorStatus;
    expectedRate: number;
    invitedAt?: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface IListCompletedContributionsRequestDTO {
  userId: string;
}

export interface IListCompletedContributionsResponseDTO {
  data: IAggregatedProject[];
}

export interface IDeleteProjectRequestDTO {
  projectId: string;
  userId: string;
}

export interface IDeleteProjectResponseDTO {
  isDeleted: boolean;
}

export interface IUpdateProjectStatusRequestDTO {
  userId: string;
  projectId: string;
  status: ProjectStatus;
}

export interface IUpdateProjectStatusResponseDTO {
  data: IProject;
}
