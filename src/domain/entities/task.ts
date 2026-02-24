import type { IProjectFile } from "../../application/interfaces/s3-bucket/file-storage.js";
import type {
  AssigneeStatus,
  TaskPaymentStatus,
  RefundStatus,
  Revision,
  SubmissionLink,
  TaskPriority,
  TaskStatus,
} from "../enums/task.js";

export interface ITask {
  id: string;
  title: string;
  projectId: string;
  assigneeId?: string | null;
  creatorId: string;
  description: string;
  expectedRate: number;
  estimatedHours: number; // estimated time
  totalAmount: number; // estimatedAmount * expectedRate
  amountInEscrow: number; // Amount in escrow
  balance: number; // Balance amount to pay
  refundAmount: number;
  refundStatus: RefundStatus;
  status: TaskStatus;
  assigneeStatus: AssigneeStatus;
  priority: TaskPriority;
  documents: IProjectFile[];
  submissionLinks: SubmissionLink[];
  paymentStatus?: TaskPaymentStatus;
  cancellationReason?: string; // for creator/admin cancellation
  revisionCount?: number; // track how many revisions were requested
 
  dueDate: Date;

  expiredAt?: Date | null; // record when task expired
  cancelledAt?: Date | null;
  acceptedAt?: Date | null;
  submittedAt?: Date | null;
  completedAt?: Date | null;
  reassignedAt?: Date | null;
  closedAt?: Date | null; // when admin marks as done (after payment)
  paidAt?: Date | null;

  revisions?: Revision[];

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
