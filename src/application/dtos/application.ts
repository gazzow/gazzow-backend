import type { IApplication } from "../../domain/entities/application.js";
import type { ApplicationStatus } from "../../domain/enums/application.js";

export interface IApplicationRequestDTO {
  projectId: string;
  applicantId: string;
  expectedRate: number;
  proposal?: string | undefined;
}

export interface IApplicationResponseDTO {
  data: IApplication;
}

export interface IListApplicationRequestDTO {
  projectId: string;
}

export interface IListApplicationResponseDTO {
  data: IApplication[] | [];
}

export interface IUpdateApplicationStatusRequestDTO {
  applicationId: string;
  projectId: string;
  status: ApplicationStatus;
}
