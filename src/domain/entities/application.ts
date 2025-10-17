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
