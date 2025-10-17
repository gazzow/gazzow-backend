import type {
  ContributorStatus,
  ProjectDurationUnit,
  ProjectExperience,
  ProjectStatus,
  ProjectVisibility,
} from "../enums/project.js";

export interface IProject {
  id: string;
  title: string;
  creatorId: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  requiredSkills: string[];
  developersNeeded: number;
  durationMin: number;
  durationMax: number;
  durationUnit: ProjectDurationUnit;
  experience: ProjectExperience;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  contributors: IContributor[];
  createdAt: string;
  updatedAt: string;
}

export interface IContributor {
  userId: string;
  status: ContributorStatus;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}
