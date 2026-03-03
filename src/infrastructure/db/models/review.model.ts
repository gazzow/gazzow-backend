import mongoose, { Schema, type Document, type Types } from "mongoose";

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

export type PartialReviewDocument = Partial<IReviewDocument>

const ReviewSchema = new Schema<IReviewDocument>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      required: true,
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
