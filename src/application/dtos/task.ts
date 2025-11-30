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
  documents?: IProjectFile[];
}

export interface AssignedTaskDTO extends BaseTaskDTO {
  assigneeId: string;
}
export interface UnassignedTaskDTO extends BaseTaskDTO {
  assigneeId?: undefined;
}

export type ICreateTaskRequestDTO = AssignedTaskDTO | UnassignedTaskDTO;

export interface ITaskResponseDTO
  extends Omit<ITask, TaskDateFields | "assigneeId"> {
  assigneeId: string | null;

  dueDate: string;
  createdAt: string;
  updatedAt: string;

  expiredAt?: string | null;
  cancelledAt?: string | null;
  submittedAT?: string | null;
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
