import logger from "../../utils/logger.js";
import type { Contributor } from "../entities/project.js";
import type { ITask } from "../entities/task.js";
import {
  AssigneeStatus,
  TaskPaymentStatus,
  RefundStatus,
  TaskStatus,
} from "../enums/task.js";

export class TaskRules {
  static hasWorkStarted(status: TaskStatus): boolean {
    return status !== TaskStatus.TODO;
  }

  static reCalculateFinancial(newTotal: number, task: ITask): Partial<ITask> {
    const update: Partial<ITask> = {};

    update.totalAmount = newTotal;
    // Case 1: User paid upfront, then increase hours
    if (task.amountInEscrow > 0 && newTotal > task.amountInEscrow) {
      logger.info("Total amount greater than escrow amount");
      update.balance = newTotal - task.amountInEscrow;
      update.paymentStatus = TaskPaymentStatus.PENDING;
    }
    // Case 2: User paid upfront, then decrease hours
    else if (task.amountInEscrow > 0 && newTotal < task.amountInEscrow) {
      logger.info("Total amount lesser than escrow amount");
      update.refundAmount = task.amountInEscrow - newTotal;
      update.refundStatus = RefundStatus.PENDING;
    }
    // Case 3: User paid upfront, now estimatedHours reset to Initial hours / totalAmount == amountInEscrow
    else if (task.amountInEscrow > 0) {
      logger.info("Total amount == escrow amount");
      update.balance = 0;
      update.refundAmount = 0;
      update.refundStatus = RefundStatus.NONE;
      update.paymentStatus = TaskPaymentStatus.ESCROW_HELD;
    }
    // Case 4: User edited hours before any payment
    else {
      logger.info("Edited hours before any payment");
      update.balance = newTotal;
      update.paymentStatus = TaskPaymentStatus.PENDING;
    }

    return update;
  }

  static getValidContributor(
    assigneeId: string,
    contributors: Contributor[]
  ): Contributor | null {
    return contributors.find((c) => c.id === assigneeId) ?? null;
  }

  static isTaskCreator(creatorId: string, userId: string): boolean {
    return creatorId === userId;
  }

  static canReassign(assigneeStatus: AssigneeStatus): boolean {
    return assigneeStatus === AssigneeStatus.ASSIGNED;
  }
}
