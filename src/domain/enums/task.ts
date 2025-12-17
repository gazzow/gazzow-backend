export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  SUBMITTED = "submitted",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  CLOSED = "closed",
  REVISIONS_REQUESTED = "revisions_requested",
}

export enum AssigneeStatus {
  UNASSIGNED = "unassigned",
  ASSIGNED = "assigned",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  ESCROW_HELD = "escrow_held",
  RELEASED = "released",
  FAILED = "failed",
}

export enum RefundStatus {
  NONE = "none",
  PENDING = "pending",
  RELEASED = "released",
  SUCCESS = "success",
  FAILED = "failed",
}

export type SubmissionLink = {
  url: string;
  label: string;
  date: Date;
};

export type Revision = {
  message: string;
  date: Date;
};
