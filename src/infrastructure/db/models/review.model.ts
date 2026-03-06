import mongoose, { Schema, type Document, type Types } from "mongoose";
import type { TaskStatus } from "../../../domain/enums/task.js";

export type IReviewDocument = Document & {
  _id: Types.ObjectId;
  taskId: Types.ObjectId;
  projectId: Types.ObjectId;
  reviewerId: Types.ObjectId;
  contributorId: Types.ObjectId;
  rating: number;
  review: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type IPartialReviewDocument = Partial<IReviewDocument>;

export interface IAggregatedReviewDocument {
  _id: string;
  rating: number;
  review: string;
  reviewer: {
    id: string;
    name: string;
  };
  task: {
    id: string;
    title: string;
    status: TaskStatus;
  };
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Task",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    contributorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const ReviewModel = mongoose.model<IReviewDocument>(
  "Review",
  ReviewSchema,
);
