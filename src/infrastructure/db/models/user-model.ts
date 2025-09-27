import mongoose, { Document, Schema, Types } from "mongoose";
import type { IUserWithPassword } from "../../../domain/entities/user.js";
import { Provider, UserRole, UserStatus } from "../../../domain/enums/user-role.js";

export type IUserDocument = Document &
  IUserWithPassword & {
    _id: Types.ObjectId;
  };

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    provider: {
      type: String,
      enum: Object.values(Provider),
      default: Provider.LOCAL,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    bio: { type: String },
    techStacks: [{ type: String }],
    learningGoals: [{ type: String }],
    experience: { type: String },
    developerRole: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
