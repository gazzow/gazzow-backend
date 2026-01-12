import mongoose, { Schema, Document, Types } from "mongoose";

export type IMessageDocument = Document & {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderName: string;
  senderImageUrl: string;
  isCreator: boolean;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

const TeamChatSchema = new Schema<IMessageDocument>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderName: {
      type: String,
      required: true,
    },

    senderImageUrl: {
      type: String,
      required: true,
    },

    isCreator: {
      type: Boolean,
      required: true,
      default: false,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Index for fast project chat loading
TeamChatSchema.index({ projectId: 1, createdAt: 1 });

export const TeamChatModel = mongoose.model<IMessageDocument>(
  "TeamChat",
  TeamChatSchema
);
