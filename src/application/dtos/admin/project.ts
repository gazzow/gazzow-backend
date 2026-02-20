import type { IProject } from "../../../domain/entities/project.js";

export interface IAdminListProjectsRequestDTO {
  search?: string;
  status?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  skip?: number;
  limit?: number;
}

export interface IAdminListProjectsResponseDTO {
  data: IProject[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface IAdminGetProjectRequestDTO {
  projectId: string;
}

export interface IAdminGetProjectResponseDTO {
  data: IProject;
}

export interface IAdminDeleteProjectRequestDTO {
  projectId: string;
}
