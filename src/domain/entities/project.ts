import type { IProjectFile } from "../../application/interfaces/s3-bucket/file-storage.js";
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
  documents: IProjectFile[];
  isDeleted: boolean;
  deletedAt: Date;
  createdAt: string;
  updatedAt: string;
}

export interface IAggregatedProject extends IProject {
  isFavorite: boolean;
  applicationCount: number;
  creator: {
    name: string;
    imageUrl: string;
  };
}

export interface IContributor {
  userId: string;
  status: ContributorStatus;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contributor {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  developerRole: string;
  status: ContributorStatus;
  expectedRate: number;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}
