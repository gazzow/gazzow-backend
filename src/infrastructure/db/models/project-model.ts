import mongoose, { Schema, type Document, type Types } from "mongoose";
import {
  ProjectExperience,
  ProjectStatus,
  ProjectVisibility,
  type ContributorStatus,
} from "../../../domain/enums/project.js";

interface IContributor {
  userId: Types.ObjectId;
  status: ContributorStatus;
  invitedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IProjectDocument = Document & {
  _id: Types.ObjectId;
  title: string;
  creatorId: Types.ObjectId;
  description: string;
  budgetAmount: number;
  requiredSkills: string[];
  developerNeeded: number;
  experience: ProjectExperience;
  deadline: Date;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  contributors: IContributor[];
  createdAt?: Date;
  updatedAt?: Date;
};

const contributorSchema = new Schema<IContributor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["invited", "active", "removed"],
      required: true,
    },
    invitedAt: { type: Date },
  },
  { timestamps: true }
);

const projectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    budgetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    developerNeeded: {
      type: Number,
      required: true,
    },
    experience: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      required: true,
    },
    contributors: [contributorSchema],
    deadline: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value > new Date(),
        message: "Deadline must be a future date.",
      },
    },
    visibility: {
      type: String,
      enum: ["public", "invite"],
      default: ProjectVisibility.PUBLIC,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: ProjectStatus.OPEN,
    },
  },
  {
    timestamps: true,
  }
);

export const ProjectModel = mongoose.model<IProjectDocument>(
  "Project",
  projectSchema
);
