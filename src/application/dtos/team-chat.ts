import type { IMessage } from "../../domain/entities/message.js";

export interface ISendTeamChatMessageRequestDTO {
  projectId: string;
  senderId: string;
  content: string;
}

export interface IListTeamChatMessagesRequestDTO {
  projectId: string;
}

export interface IListTeamChatMessagesResponseDTO {
  data: IMessage[];
}

export type DeleteMessageType = "FOR_ME" | "FOR_EVERYONE";

export interface IDeleteTeamChatMessageRequestDTO {
  type: DeleteMessageType;
  userId: string;
  messageId: string;
}
