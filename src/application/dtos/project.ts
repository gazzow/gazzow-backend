import type { IProject } from "../../domain/entities/project.js";
import type {
  ProjectDurationUnit,
  ProjectExperience,
  ProjectStatus,
  ProjectVisibility,
} from "../../domain/enums/project.js";

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
}

export interface ICreateProjectResponseDTO {
  data: IProject;
}

export interface IListProjectResponseDTO {
  data: IProject[];
}

export interface IListMyProjectRequestDTO {
  creatorId: string;
}

export interface IListMyProjectsResponseDTO {
  data: IProject[];
}
