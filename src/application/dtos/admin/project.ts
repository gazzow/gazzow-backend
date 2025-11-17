import type { IProject } from "../../../domain/entities/project.js";

export interface IAdminListProjectsResponseDTO {
  data: IProject[];
}
