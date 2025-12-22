import { Schema, Types, model } from "mongoose";

export type ITaskCommentDocument = Document & {
  _id: Types.ObjectId;
  taskId: Types.ObjectId;
  author: TaskCommentUser;
  content: string;
  isCreator: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface TaskCommentUser {
  id: Types.ObjectId;
  name: string;
  imageUrl?: string;
}

const TaskCommentSchema = new Schema<ITaskCommentDocument>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    author: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      imageUrl: { type: String },
    },

    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    isCreator: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const TaskCommentModel = model("TaskComment", TaskCommentSchema);

TaskCommentSchema.index({ taskId: 1, createdAt: -1 });
