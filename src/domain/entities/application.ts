import type { IApplicationDocument } from "../../infrastructure/db/models/application-model.js";
import type { ApplicationStatus } from "../enums/application.js";

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
