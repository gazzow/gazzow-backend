import mongoose, { Schema, type Document, type Types } from "mongoose";
import {
  ProjectExperience,
  ProjectStatus,
  ProjectVisibility,
  ProjectDurationUnit,
  ContributorStatus,
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
  budgetMin: number;
  budgetMax: number;
  requiredSkills: string[];
  developersNeeded: number;
  durationMin: number;
  durationMax: number;
  durationUnit: ProjectDurationUnit;
  experience: ProjectExperience;
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
      enum: Object.values(ContributorStatus),
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
    budgetMin: {
      type: Number,
      required: true,
      min: 0,
    },
    budgetMax: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (this: IProjectDocument, value: number) {
          return value >= this.budgetMin;
        },
        message: "Budget max must be greater than or equal to budget min.",
      },
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    developersNeeded: {
      type: Number,
      required: true,
    },
    durationMin: {
      type: Number,
      required: true,
      min: 1,
    },
    durationMax: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: function (this: IProjectDocument, value: number) {
          return value >= this.durationMin;
        },
        message: "Duration max must be greater than or equal to duration min.",
      },
    },
    durationUnit: {
      type: String,
      enum:  Object.values(ProjectDurationUnit),
      required: true,
    },
    experience: {
      type: String,
      enum:  Object.values(ProjectExperience),
      required: true,
    },
    contributors: [contributorSchema],
    visibility: {
      type: String,
      enum: Object.values(ProjectVisibility),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
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
