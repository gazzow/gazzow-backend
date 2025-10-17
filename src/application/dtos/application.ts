import type { IApplication } from "../../domain/entities/application.js";

export interface IApplicationRequestDTO {
  projectId: string;
  applicantId: string;
  expectedRate: number;
  proposal?: string | undefined;
}

export interface IApplicationResponseDTO {
  data: IApplication;
}
