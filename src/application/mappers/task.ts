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
  toDomain(doc: ITaskDocument): ITask;
  toPersistent(dto: ICreateTaskRequestDTO): Partial<ITaskDocument>;
  toResponseDTO(taskDoc: ITaskDocument): ITaskResponseDTO;
  toPopulatedResponseDTO(
    taskDoc: IPopulatedTaskDocument
  ): IPopulatedResponseDTO;
  toUpdatePersistent(dto: Partial<ITask>): Partial<ITaskDocument>;
  toReassignPersistent(data: Partial<ITask>): Partial<ITaskDocument>;
}

export class TaskMapper implements ITaskMapper {
  toDomain(taskDoc: ITaskDocument): ITask {
    return {
      id: taskDoc._id.toString(),
      title: taskDoc.title,
      projectId: taskDoc.projectId.toString(),
      assigneeId: taskDoc.assigneeId?.toString() ?? null,
      creatorId: taskDoc.creatorId.toString(),
      description: taskDoc.description,
      expectedRate: taskDoc.expectedRate,
      estimatedHours: taskDoc.estimatedHours,
      totalAmount: taskDoc.totalAmount,
      amountInEscrow: taskDoc.amountInEscrow,
      balance: taskDoc.balance,
      refundAmount: taskDoc.refundAmount,
      refundStatus: taskDoc.refundStatus,
      status: taskDoc.status,
      assigneeStatus: taskDoc.assigneeStatus,
      paymentStatus: taskDoc.paymentStatus,
      priority: taskDoc.priority,
      documents: taskDoc.documents,
      submissionLinks: taskDoc.submissionLinks,
      dueDate: taskDoc.dueDate,
      isDeleted: taskDoc.isDeleted,
      createdAt: taskDoc.createdAt,
      updatedAt: taskDoc.updatedAt,
    };
  }

  toPersistent(dto: ICreateTaskRequestDTO): Partial<ITaskDocument> {
    const base: Partial<ITaskDocument> = {
      title: dto.title,
      projectId: new Types.ObjectId(dto.projectId),
      creatorId: new Types.ObjectId(dto.creatorId),
      description: dto.description,
      estimatedHours: dto.estimatedHours,
      expectedRate: dto.expectedRate,
      totalAmount: dto.estimatedHours * dto.expectedRate,
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
      totalAmount: taskDoc.totalAmount,
      amountInEscrow: taskDoc.amountInEscrow,
      balance: taskDoc.balance,
      refundAmount: taskDoc.refundAmount,
      refundStatus: taskDoc.refundStatus,
      status: taskDoc.status,
      assigneeStatus: taskDoc.assigneeStatus,
      paymentStatus: taskDoc.paymentStatus,
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
      totalAmount: taskDoc.totalAmount,
      amountInEscrow: taskDoc.amountInEscrow,
      balance: taskDoc.balance,
      refundAmount: taskDoc.refundAmount,
      refundStatus: taskDoc.refundStatus,
      status: taskDoc.status,
      assigneeStatus: taskDoc.assigneeStatus,
      priority: taskDoc.priority,
      acceptedAt: taskDoc.acceptedAt?.toISOString() ?? null,
      submittedAt: taskDoc.submittedAt?.toISOString() ?? null,
      paidAt: taskDoc.paidAt?.toISOString() ?? null,
      completedAt: taskDoc.completedAt?.toString() ?? null,
      submissionLinks: taskDoc.submissionLinks,
      documents: taskDoc.documents,
      dueDate: taskDoc.dueDate.toISOString(),
      paymentStatus: taskDoc.paymentStatus,
      isDeleted: taskDoc.isDeleted,
      createdAt: taskDoc.createdAt.toISOString(),
      updatedAt: taskDoc.updatedAt.toISOString(),
    };
  }

  toUpdatePersistent(dto: Partial<ITask>): Partial<ITaskDocument> {
    const update: Partial<ITaskDocument> = {};

    if (dto.title !== undefined) update.title = dto.title;

    if (dto.description !== undefined) update.description = dto.description;

    if (dto.estimatedHours !== undefined) {
      update.estimatedHours = dto.estimatedHours;
    }

    if (dto.expectedRate !== undefined) {
      update.expectedRate = dto.expectedRate;
    }

    if (dto.priority !== undefined) update.priority = dto.priority;

    if (dto.assigneeId !== undefined && dto.assigneeId !== null) {
      update.assigneeId = new Types.ObjectId(dto.assigneeId);
      update.assigneeStatus = AssigneeStatus.ASSIGNED;
    }

    if (dto.dueDate !== undefined) update.dueDate = dto.dueDate;

    if (dto.totalAmount !== undefined) {
      update.totalAmount = dto.totalAmount;
    }

    if (dto.balance !== undefined) update.balance = dto.balance;

    if (dto.amountInEscrow !== undefined)
      update.amountInEscrow = dto.amountInEscrow;

    if (dto.paymentStatus !== undefined)
      update.paymentStatus = dto.paymentStatus;

    if (dto.refundAmount !== undefined) update.refundAmount = dto.refundAmount;

    if (dto.refundStatus !== undefined) update.refundStatus = dto.refundStatus;

    return update;
  }

  toReassignPersistent(data: Partial<ITask>): Partial<ITaskDocument> {
    const update: Partial<ITaskDocument> = {};

    if (data.assigneeId) {
      update.assigneeId = new Types.ObjectId(data.assigneeId);
      update.assigneeStatus = AssigneeStatus.ASSIGNED
    }

    if (data.expectedRate !== undefined) {
      update.expectedRate = data.expectedRate;
    } 

    if (data.totalAmount !== undefined) {
      update.totalAmount = data.totalAmount;
    }

    if (data.balance !== undefined) update.balance = data.balance;

    if (data.amountInEscrow !== undefined)
      update.amountInEscrow = data.amountInEscrow;

    if (data.paymentStatus !== undefined)
      update.paymentStatus = data.paymentStatus;

    if (data.refundAmount !== undefined)
      update.refundAmount = data.refundAmount;

    if (data.refundStatus !== undefined)
      update.refundStatus = data.refundStatus;

    return update;
  }
}
