import type { IApplicationDocument } from "../../infrastructure/db/models/application-model.js";
import type { ApplicationStatus } from "../enums/application.js";
import type { ProjectDurationUnit } from "../enums/project.js";
import type { IProject } from "./project.js";

export interface IApplication {
  id: string;
  projectId: string;
  applicantId: string;
  expectedRate: number;
  status: ApplicationStatus;
  proposal?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface IApplicationDocumentWithApplicant
  extends IApplicationDocument {
  applicant: {
    name: string;
    developerRole: string;
    experience: string;
    techStacks: string[];
    imageUrl: string;
  };
}

export interface IApplicationWithApplicant extends IApplication {
  applicant: {
    name: string;
    developerRole: string;
    experience: string;
    techStacks: string[];
    imageUrl: string;
  };
}

export type ProjectPreviewDTO = {
  id?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  budgetMin?: number | undefined;
  budgetMax?: number | undefined;
  durationMin?: number | undefined;
  durationMax?: number | undefined;
  durationUnit?: ProjectDurationUnit | undefined;
};

export interface IApplicationWithPopulatedProject
  extends Omit<IApplication, "projectId"> {
  projectId: Partial<ProjectPreviewDTO>;
}
