import type { FilterQuery } from "mongoose";
import type {
  IPopulatedTaskDocument,
  ITaskDocument,
} from "../../../infrastructure/db/models/task-model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface ITaskRepository extends IBaseRepository<ITaskDocument> {
  findByAssigneeId(assigneeId: string): Promise<ITaskDocument[] | null>;
  findByProjectAndUser(query: {
    filter?: FilterQuery<ITaskDocument>;
    skip?: number;
    limit?: number;
  }): Promise<IPopulatedTaskDocument[]>;
}
