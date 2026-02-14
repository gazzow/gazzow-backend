import type { FilterQuery } from "mongoose";
import type {
  IPopulatedTaskDocument,
  ITaskDocument,
} from "../../../infrastructure/db/models/task-model.js";
import type { IBaseRepository } from "./base-repository.js";
import type { ITaskStatistics } from "../../dtos/task.js";

export interface ITaskRepository extends IBaseRepository<ITaskDocument> {
  findByAssigneeId(
    projectId: string,
    assigneeId: string,
  ): Promise<ITaskDocument[] | null>;
  findByProjectAndUser(query: {
    filter?: FilterQuery<ITaskDocument>;
    skip?: number;
    limit?: number;
  }): Promise<IPopulatedTaskDocument[]>;
  findByIdAndPopulate(taskId: string): Promise<IPopulatedTaskDocument | null>;
  getTaskStatusOverview(assigneeId: string): Promise<ITaskStatistics[]>;
  getCompletedTaskByAssigneeId(assigneeId: string): Promise<ITaskDocument[]>;
  existsActiveTask(projectId: string): Promise<boolean>;
}
