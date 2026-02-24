import mongoose, { Document, Schema, Types } from "mongoose";
import {
  AssigneeStatus,
  TaskPaymentStatus,
  RefundStatus,
  TaskPriority,
  TaskStatus,
  type Revision,
  type SubmissionLink,
} from "../../../domain/enums/task.js";
import type { IProjectFile } from "../../../application/interfaces/s3-bucket/file-storage.js";
import type { IProjectDocument } from "./project-model.js";
import type { IUserDocument } from "./user-model.js";

// -------------------------------------------
// Mongoose Document Interface
// -------------------------------------------
export type ITaskDocument = Document & {
  _id: Types.ObjectId;
  title: string;
  projectId: Types.ObjectId;
  creatorId: Types.ObjectId;
  assigneeId?: Types.ObjectId | null;
  description: string;
  expectedRate: number;
  estimatedHours: number;
  totalAmount: number;
  amountInEscrow: number;
  balance: number;
  refundAmount: number;
  refundStatus: RefundStatus;
  status: TaskStatus;
  assigneeStatus: AssigneeStatus;
  priority: TaskPriority;

  documents: IProjectFile[];
  submissionLinks: SubmissionLink[];

  paymentStatus: TaskPaymentStatus;
  rejectionReason?: string;
  cancellationReason?: string;
  revisionCount?: number;

  dueDate: Date;

  ExpiredAt?: Date | null;
  cancelledAt?: Date | null;
  acceptedAt?: Date | null;
  submittedAt?: Date | null;
  completedAt?: Date | null;
  reassignedAt?: Date | null;
  closedAt?: Date | null;
  paidAt?: Date | null;

  revisions?: Revision[];

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface IPopulatedTaskDocument
  extends Omit<ITaskDocument, "projectId" | "assigneeId" | "creatorId"> {
  projectId: IProjectDocument;
  assigneeId?: IUserDocument | null;
  creatorId: IUserDocument;
}

// -------------------------------------------
// Sub-schemas
// -------------------------------------------
const TaskFileSchema = new Schema<IProjectFile>(
  {
    key: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
  },
  { _id: false },
);

const SubmissionLinkSchema = new Schema<SubmissionLink>(
  {
    url: { type: String, trim: true, required: true },
    label: { type: String, trim: true, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false },
);

const RevisionSchema = new Schema<Revision>(
  {
    message: { type: String, trim: true, required: true, maxlength: 500 },
    date: { type: Date, default: Date.now },
  },
  { _id: false },
);

// -------------------------------------------
// Main Task Schema
// -------------------------------------------
const taskSchema = new Schema<ITaskDocument>(
  {
    title: { type: String, required: true, trim: true, maxLength: 200 },

    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    estimatedHours: { type: Number, required: true, min: 0 },
    expectedRate: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    balance: { type: Number, default: 0, min: 0 },
    amountInEscrow: { type: Number, default: 0, min: 0 },
    refundAmount: { type: Number, default: 0, min: 0 },
    refundStatus: {
      type: String,
      enum: Object.values(RefundStatus),
      default: RefundStatus.NONE,
    },

    dueDate: { type: Date, required: true },

    assigneeStatus: {
      type: String,
      enum: Object.values(AssigneeStatus),
      default: AssigneeStatus.UNASSIGNED,
    },

    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
      required: true,
    },

    // Attachments and Links
    documents: { type: [TaskFileSchema], default: [] },
    submissionLinks: { type: [SubmissionLinkSchema], default: [] },

    // Payment
    paymentStatus: {
      type: String,
      enum: Object.values(TaskPaymentStatus),
      default: TaskPaymentStatus.PENDING,
      required: true,
    },

    // Optional lifecycle reasons
    rejectionReason: { type: String, trim: true, default: null },
    cancellationReason: { type: String, trim: true, default: null },

    // Tracking revisions and progress
    revisionCount: { type: Number, default: 0 },
    revisions: { type: [RevisionSchema], default: [] },

    // Important Dates
    ExpiredAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    acceptedAt: { type: Date, default: null },
    submittedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    reassignedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },

    // Flags
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// -------------------------------------------
// Indexes (optional but recommended)
// -------------------------------------------
// For faster lookups by project or assignee
taskSchema.index({ projectId: 1 });
taskSchema.index({ assigneeId: 1 });
taskSchema.index({ creatorId: 1 });

// -------------------------------------------
// Model Export
// -------------------------------------------
export const TaskModel = mongoose.model<ITaskDocument>("Task", taskSchema);
