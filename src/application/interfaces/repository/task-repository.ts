import type { FilterQuery } from "mongoose";
import type {
  IPopulatedTaskDocument,
  ITaskDocument,
} from "../../../infrastructure/db/models/task-model.js";
import type { IBaseRepository } from "./base-repository.js";
import type { IMonthlyRevenue } from "../../dtos/admin/dashboard.js";

export interface ITaskRepository extends IBaseRepository<ITaskDocument> {
  findByAssigneeId(assigneeId: string): Promise<ITaskDocument[] | null>;
  findByProjectAndUser(query: {
    filter?: FilterQuery<ITaskDocument>;
    skip?: number;
    limit?: number;
  }): Promise<IPopulatedTaskDocument[]>;
  findByIdAndPopulate(taskId: string): Promise<IPopulatedTaskDocument | null>;
  getMonthlyPlatformRevenue(): Promise<IMonthlyRevenue[]>;
  getTotalEarnings(userId: string): Promise<number>
}
