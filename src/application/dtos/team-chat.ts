import type { IMessage } from "../../domain/entities/message.js";


export interface ISendTeamChatMessageRequestDTO {
  projectId: string;
  senderId: string;
  content: string;
}

export interface IListTeamChatMessagesRequestDTO {
  projectId: string;
}

export interface IListTeamChatMessagesResponseDTO{
    data: IMessage[]
}
