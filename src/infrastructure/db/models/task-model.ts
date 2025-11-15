import mongoose, { Document, Schema, Types } from "mongoose";
import {
  PaymentStatus,
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
  assigneeId: Types.ObjectId;
  description: string;
  expectedRate: number;
  estimatedHours: number;
  proposedAmount: number;
  status: TaskStatus;
  priority: TaskPriority;

  documents: IProjectFile[];
  submissionLinks: SubmissionLink[];

  paymentStatus: PaymentStatus;
  rejectionReason?: string;
  cancellationReason?: string;
  revisionCount?: number;

  ExpiredAt?: Date;
  cancelledAt?: Date;
  acceptedAt?: Date;
  // submittedAt?: Date;
  completedAt?: Date;
  dueDate: Date;
  closedAt?: Date;
  paidAt?: Date;

  revisions?: Revision[];

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface IPopulatedTaskDocument
  extends Omit<ITaskDocument, "projectId" | "assigneeId" | "creatorId"> {
  projectId: IProjectDocument;
  assigneeId: IUserDocument;
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
  { _id: false }
);

const SubmissionLinkSchema = new Schema<SubmissionLink>(
  {
    url: { type: String, trim: true, required: true },
    label: { type: String, trim: true, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const RevisionSchema = new Schema<Revision>(
  {
    message: { type: String, trim: true, required: true, maxlength: 500 },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
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
      required: true,
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
    proposedAmount: { type: Number, required: true, min: 0 },

    dueDate: { type: Date, required: true },

    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.ASSIGNED,
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
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
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
    completedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },

    // Flags
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
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
