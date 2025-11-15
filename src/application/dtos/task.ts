import type { Express } from "express";
import type { IProjectFile } from "../interfaces/s3-bucket/file-storage.js";
import type { ITask } from "../../domain/entities/task.js";
import type { TaskPriority } from "../../domain/enums/task.js";
import type { IProject } from "../../domain/entities/project.js";
import type { IUser } from "../../domain/entities/user.js";

export interface ICreateTaskRequestDTO {
  title: string;
  projectId: string;
  assigneeId: string;
  creatorId: string;
  description: string;
  estimatedHours: number;
  expectedRate: number;
  priority: TaskPriority;
  files?: Express.Multer.File[];
  documents?: IProjectFile[];
  dueDate: Date;
}

export interface ITaskResponseDTO
  extends Omit<
    ITask,
    | "dueDate"
    | "createdAt"
    | "updatedAt"
    | "expiredAt"
    | "completedAt"
    | "submittedAt"
    | "cancelledAt"
    | "closedAt"
    | "paidAt"
  > {
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  expiredAt?: string;
  cancelledAt?: string;
  submittedA?: string;
  completedAt?: string;
  closedAt?: string;
  paidAt?: string;
}

export interface IPopulatedResponseDTO
  extends Omit<ITaskResponseDTO, "projectId" | "assigneeId" | "creatorId"> {
  projectId: Partial<IProject>;
  assigneeId: Partial<IUser>;
  creatorId: Partial<IUser>;
}

export interface IListTasksByContributorRequestDTO {
  projectId: string;
  userId: string;
}

export interface IListTasksByContributorResponseDTO {
  data: ITaskResponseDTO[];
}

export interface IListTasksByCreatorRequestDTO {
  projectId: string;
  userId: string;
}

export interface IListTasksByCreatorResponseDTO {
  data: ITaskResponseDTO[];
}
