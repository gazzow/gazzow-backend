import mongoose, { Schema, type Document, type Types } from "mongoose";
import { ApplicationStatus } from "../../../domain/enums/application.js";
import type { IProjectDocument } from "./project-model.js";

export interface IApplicationDocument extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  applicantId: Types.ObjectId;
  expectedRate: number;
  status: ApplicationStatus;
  proposal?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplicationPopulatedProjectDocument
  extends Omit<IApplicationDocument, "projectId"> {
  projectId: Partial<IProjectDocument>;
}

const applicationSchema = new Schema<IApplicationDocument>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expectedRate: {
      type: Number,
      required: true,
    },
    proposal: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
    },
  },
  { timestamps: true }
);

export const ApplicationModel = mongoose.model<IApplicationDocument>(
  "Application",
  applicationSchema
);
