import type { IProject } from "../../../domain/entities/project.js";

export interface IAdminListProjectsResponseDTO {
  data: IProject[];
}

export interface IAdminGetProjectRequestDTO {
  projectId: string;
}

export interface IAdminGetProjectResponseDTO {
  data: IProject;
}
