import type { DeleteMessageType } from "../../application/dtos/team-chat.js";

export interface IMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderImageUrl: string;
  isCreator: boolean;
  content: string;
  deletedFor: string[];
  isDeletedForEveryone: boolean;
  deletedAt: Date;
  isEdited: boolean;
  editedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationPayload {
  projectId: string;
  title: string;
  message: string;
}

export interface IDeletedMessageSocketPayload {
  messageId: string;
  userId: string;
  type: DeleteMessageType;
}
