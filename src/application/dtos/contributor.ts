import type { IProject } from "../../domain/entities/project.js";

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
