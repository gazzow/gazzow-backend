import type { IProjectFile } from "../../application/interfaces/s3-bucket/file-storage.js";
import type {
  AssigneeStatus,
  PaymentStatus,
  Revision,
  SubmissionLink,
  TaskPriority,
  TaskStatus,
} from "../enums/task.js";

export interface ITask {
  id: string;
  title: string;
  projectId: string;
  assigneeId?: string;
  creatorId: string;
  description: string;
  expectedRate: number;
  estimatedHours: number; // estimated time
  proposedAmount: number; // expectedRate * estimatedHours
  status: TaskStatus;
  assigneeStatus: AssigneeStatus;
  priority: TaskPriority;
  documents: IProjectFile[];
  submissionLinks: SubmissionLink[];
  paymentStatus?: PaymentStatus;
  cancellationReason?: string; // for creator/admin cancellation
  revisionCount?: number; // track how many revisions were requested
  expiredAt?: Date; // record when task expired
  cancelledAt?: Date;
  acceptedAt?: Date;
  submittedAt?: Date;
  completedAt?: Date;
  dueDate: Date;
  closedAt?: Date; // when admin marks as done (after payment)
  paidAt?: Date;

  revisions?: Revision[];

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
