import { type Model } from "mongoose";
import type { ITeamChatDocument } from "../db/models/team-chat.model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { ITeamChatRepository } from "../../application/interfaces/repository/team-chat.repository.js";

export class TeamChatRepository
  extends BaseRepository<ITeamChatDocument>
  implements ITeamChatRepository
{
  constructor(model: Model<ITeamChatDocument>) {
    super(model);
  }

  findByProjectId(projectId: string): Promise<ITeamChatDocument[]> {
    return this.model.find({ projectId });
  }

  addToDeletedFor(
    messageId: string,
    userId: string,
  ): Promise<ITeamChatDocument | null> {
    return this.model.findByIdAndUpdate(
      messageId,
      {
        $addToSet: {
          deletedFor: userId,
        },
      },
      { new: true },
    );
  }

  markDeletedForEveryone(
    messageId: string,
    userId: string,
  ): Promise<ITeamChatDocument | null> {
    return this.model.findOneAndUpdate(
      { _id: messageId, senderId: userId },
      {
        isDeletedForEveryone: true,
        deletedAt: new Date(),
      },
      { new: true },
    );
  }
}
