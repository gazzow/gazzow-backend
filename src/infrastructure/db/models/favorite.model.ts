import { Schema, Types, model, Document } from "mongoose";
import type { IProjectDocument } from "./project-model.js";

export type IFavoriteDocument = Document & {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type IFavoritePopulatedDocument = Omit<IFavoriteDocument, "projectId"> & {
  projectId: Partial<IProjectDocument>;
};

const FavoriteSchema = new Schema<IFavoriteDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FavoriteModel = model<IFavoriteDocument>(
  "Favorite",
  FavoriteSchema
);
