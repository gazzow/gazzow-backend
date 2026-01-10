import type { Express } from "express";
import type { IProjectFile } from "../interfaces/s3-bucket/file-storage.js";
import type { ITask } from "../../domain/entities/task.js";
import type { TaskPriority } from "../../domain/enums/task.js";
import type { IProject } from "../../domain/entities/project.js";
import type { IUser } from "../../domain/entities/user.js";
import type { TaskDateFields } from "../../domain/types/task.js";

export interface BaseTaskDTO {
  title: string;
  projectId: string;
  creatorId: string;
  description: string;
  estimatedHours: number;
  expectedRate: number;
  priority: TaskPriority;
  dueDate: Date;
  files?: Express.Multer.File[];
  documents: IProjectFile[];
}

export interface AssignedTaskDTO extends BaseTaskDTO {
  assigneeId: string;
}
export interface UnassignedTaskDTO extends BaseTaskDTO {
  assigneeId?: undefined;
}

export type ICreateTaskRequestDTO = AssignedTaskDTO | UnassignedTaskDTO;

export interface ICreateTaskResponseDTO {
  data: ITaskResponseDTO;
}

export interface ITaskResponseDTO
  extends Omit<ITask, TaskDateFields | "assigneeId"> {
  assigneeId: string | null;

  dueDate: string;
  createdAt: string;
  updatedAt: string;

  expiredAt?: string | null;
  cancelledAt?: string | null;
  acceptedAt?: string | null;
  submittedAt?: string | null;
  completedAt?: string | null;
  closedAt?: string | null;
  paidAt?: string | null;
}

export interface IPopulatedResponseDTO
  extends Omit<ITaskResponseDTO, "projectId" | "assigneeId" | "creatorId"> {
  project: Partial<IProject>;
  assignee: Partial<IUser> | null;
  creator: Partial<IUser>;
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

export interface IUpdateTaskRequestDTO {
  userId: string;
  taskId: string;
  data: Partial<ITask>;
}

export interface IUpdateTaskResponseDTO {
  data: ITaskResponseDTO;
}

export interface IGetTaskRequestDTO {
  taskId: string;
  userId: string;
}

export interface IGetTaskResponseDTO {
  data: IPopulatedResponseDTO;
}

export interface IStartWorkRequestDTO {
  taskId: string;
  time: Date;
}

export interface IStartWorkResponseDTO {
  data: IPopulatedResponseDTO;
}

export interface ISubmitTaskRequestDTO {
  taskId: string;
  time: Date;
}

export interface ISubmitTaskResponseDTO {
  data: IPopulatedResponseDTO;
}

export interface ICompleteTaskRequestDTO {
  taskId: string;
  time: Date;
}

export interface ICompleteTaskResponseDTO {
  data: IPopulatedResponseDTO;
}

export interface IReassignTaskRequestDTO {
  userId: string;
  taskId: string;
  assigneeId: string;
}

export interface IReassignTaskResponseDTO {
  data: ITaskResponseDTO;
}

export interface ITaskStatistics {
  plan: string;
  count: number;
}
