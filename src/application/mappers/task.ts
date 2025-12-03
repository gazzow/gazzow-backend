import { Types } from "mongoose";
import type {
  IPopulatedTaskDocument,
  ITaskDocument,
} from "../../infrastructure/db/models/task-model.js";
import type {
  ICreateTaskRequestDTO,
  IPopulatedResponseDTO,
  ITaskResponseDTO,
} from "../dtos/task.js";
import { AssigneeStatus } from "../../domain/enums/task.js";
import type { ITask } from "../../domain/entities/task.js";

export interface ITaskMapper {
  toPersistent(dto: ICreateTaskRequestDTO): Partial<ITaskDocument>;
  toResponseDTO(taskDoc: ITaskDocument): ITaskResponseDTO;
  toPopulatedResponseDTO(
    taskDoc: IPopulatedTaskDocument
  ): IPopulatedResponseDTO;
  toUpdatePersistent(dto: Partial<ITask>): Partial<ITaskDocument>;
}

export class TaskMapper implements ITaskMapper {
  toPersistent(dto: ICreateTaskRequestDTO): Partial<ITaskDocument> {
    const base: Partial<ITaskDocument> = {
      title: dto.title,
      projectId: new Types.ObjectId(dto.projectId),
      creatorId: new Types.ObjectId(dto.creatorId),
      description: dto.description,
      estimatedHours: dto.estimatedHours,
      expectedRate: dto.expectedRate,
      proposedAmount: dto.estimatedHours * dto.expectedRate,
      priority: dto.priority,
      dueDate: dto.dueDate,
    };

    if ("assigneeId" in dto && dto.assigneeId) {
      return {
        ...base,
        assigneeId: new Types.ObjectId(dto.assigneeId),
        assigneeStatus: AssigneeStatus.ASSIGNED,
      };
    }

    return {
      ...base,
      assigneeStatus: AssigneeStatus.UNASSIGNED,
    };
  }

  toResponseDTO(taskDoc: ITaskDocument): ITaskResponseDTO {
    return {
      id: taskDoc._id.toString(),
      title: taskDoc.title,
      projectId: taskDoc.projectId.toString(),
      assigneeId: taskDoc.assigneeId?.toString() ?? null,
      creatorId: taskDoc.creatorId.toString(),
      description: taskDoc.description,
      expectedRate: taskDoc.expectedRate,
      estimatedHours: taskDoc.estimatedHours,
      proposedAmount: taskDoc.proposedAmount,
      status: taskDoc.status,
      assigneeStatus: taskDoc.assigneeStatus,
      priority: taskDoc.priority,
      documents: taskDoc.documents,
      submissionLinks: taskDoc.submissionLinks,
      dueDate: taskDoc.dueDate.toISOString(),
      isDeleted: taskDoc.isDeleted,
      createdAt: taskDoc.createdAt.toISOString(),
      updatedAt: taskDoc.updatedAt.toISOString(),
    };
  }

  toPopulatedResponseDTO(
    taskDoc: IPopulatedTaskDocument
  ): IPopulatedResponseDTO {
    return {
      id: taskDoc._id.toString(),
      title: taskDoc.title,

      project: {
        id: taskDoc.projectId._id.toString(),
        title: taskDoc.projectId.title,
      },

      assignee:
        typeof taskDoc.assigneeId === "object" && taskDoc.assigneeId
          ? {
              id: taskDoc.assigneeId._id.toString(),
              name: taskDoc.assigneeId.name,
              email: taskDoc.assigneeId.email,
              developerRole: taskDoc.assigneeId.developerRole ?? "",
            }
          : null,

      creator: {
        id: taskDoc.creatorId._id.toString(),
        name: taskDoc.creatorId.name,
        email: taskDoc.creatorId.email,
      },

      description: taskDoc.description,
      expectedRate: taskDoc.expectedRate,
      estimatedHours: taskDoc.estimatedHours,
      proposedAmount: taskDoc.proposedAmount,
      status: taskDoc.status,
      assigneeStatus: taskDoc.assigneeStatus,
      priority: taskDoc.priority,
      acceptedAt: taskDoc.acceptedAt?.toISOString() ?? null,
      documents: taskDoc.documents,
      submissionLinks: taskDoc.submissionLinks,

      dueDate: taskDoc.dueDate.toISOString(),
      paymentStatus: taskDoc.paymentStatus,
      isDeleted: taskDoc.isDeleted,
      createdAt: taskDoc.createdAt.toISOString(),
      updatedAt: taskDoc.updatedAt.toISOString(),
    };
  }

  toUpdatePersistent(dto: Partial<ITask>): Partial<ITaskDocument> {
    const update: Partial<ITaskDocument> = {};

    if (dto.title) update.title = dto.title;
    if (dto.description) update.description = dto.description;
    if (dto.estimatedHours) update.estimatedHours = dto.estimatedHours;

    if (dto.estimatedHours && dto.expectedRate)
      update.proposedAmount = dto.estimatedHours * dto.expectedRate;

    if (dto.priority) update.priority = dto.priority;
    if (dto.assigneeId) new Types.ObjectId(dto.assigneeId);

    if (dto.dueDate) update.dueDate = dto.dueDate;

    return update;
  }
}
