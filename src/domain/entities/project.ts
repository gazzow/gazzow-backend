import type {
  ContributorStatus,
  ProjectExperience,
  ProjectStatus,
  ProjectVisibility,
} from "../enums/project.js";

export interface IProject {
  id: string;
  title: string;
  creatorId: string;
  description: string;
  budgetAmount: number;
  requiredSkills: string[];
  developerNeeded: number;
  experience: ProjectExperience,
  deadline: string;
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
