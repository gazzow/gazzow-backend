import { Types } from "mongoose";
import type { IMessage } from "../../domain/entities/message.js";
import type { IMessageDocument } from "../../infrastructure/db/models/team-chat.model.js";

export interface ITeamChatMapper {
  toPersistent(data: Partial<IMessage>): Partial<IMessageDocument>;
  toResponseDTO(doc: IMessageDocument): IMessage;
}

export class TeamChatMapper implements ITeamChatMapper {
  toPersistent(data: Partial<IMessage>): Partial<IMessageDocument> {
    const persistent: Partial<IMessageDocument> = {};

    if (data.projectId)
      persistent.projectId = new Types.ObjectId(data.projectId);

    if (data.senderId) persistent.senderId = new Types.ObjectId(data.senderId);

    if (data.senderName) persistent.senderName = data.senderName;

    if (data.senderImageUrl) persistent.senderImageUrl = data.senderImageUrl;

    if (data.content) persistent.content = data.content;

    if (data.isCreator) persistent.isCreator = data.isCreator;

    return persistent;
  }

  toResponseDTO(doc: IMessageDocument): IMessage {
    return {
      id: doc._id.toString(),
      projectId: doc.projectId.toString(),
      senderId: doc.senderId.toString(),
      senderName: doc.senderName,
      senderImageUrl: doc.senderImageUrl,
      content: doc.content,
      isCreator: doc.isCreator,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
