export enum TaskStatus {
  ASSIGNED = "assigned",
  IN_PROGRESS = "in_progress",
  SUBMITTED = "submitted",
  REVISIONS_REQUESTED = "revisions_requested",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  CLOSED = "closed",
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
  REFUNDED = "refunded",
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
