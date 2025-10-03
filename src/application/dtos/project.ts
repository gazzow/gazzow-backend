import type { IProject } from "../../domain/entities/project.js";
import type { ProjectExperience, ProjectStatus, ProjectVisibility } from "../../domain/enums/project.js";

export interface ICreateProjectRequestDTO {
  title: string;
  creatorId: string;
  description: string;
  budgetAmount: number;
  requiredSkills: string[];
  experience: ProjectExperience,
  developerNeeded: number;
  deadline: Date;
  visibility: ProjectVisibility;
  status: ProjectStatus;
}

export interface ICreateProjectResponseDTO{
    data: IProject
}


export interface IListProjectResponseDTO{
  data: IProject[];
}