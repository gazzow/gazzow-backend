import type { ITeamChatDocument } from "../../../infrastructure/db/models/team-chat.model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface ITeamChatRepository
  extends IBaseRepository<ITeamChatDocument> {
  findByProjectId(projectId: string): Promise<ITeamChatDocument[]>;
  addToDeletedFor(
    messageId: string,
    userId: string,
  ): Promise<ITeamChatDocument | null>;
  markDeletedForEveryone(messageId: string, userId: string): Promise<ITeamChatDocument | null>;
}
