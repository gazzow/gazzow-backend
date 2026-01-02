import type { IFavorite } from "../../domain/entities/favorite.js";
import type { IProject } from "../../domain/entities/project.js";

export interface IFavoriteResponseDTO extends Omit<IFavorite, "projectId"> {
  project: Partial<IProject>;
}

export interface IAddProjectFavoriteRequestDTO {
  userId: string;
  projectId: string;
}

export interface IAddProjectFavoriteResponseDTO {
  data: IFavorite;
}

export interface IListFavoriteProjectsRequestDTO {
  userId: string;
}

export interface IListFavoriteProjectsResponseDTO {
  data: IFavoriteResponseDTO[];
}

export interface IRemoveFavoriteProjectRequestDTO {
  userId: string;
  projectId: string;
}
