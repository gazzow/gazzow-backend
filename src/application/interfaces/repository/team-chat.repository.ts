import type { IMessageDocument } from "../../../infrastructure/db/models/team-chat.model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface ITeamChatRepository extends IBaseRepository<IMessageDocument> {
  findByProjectId(projectId: string): Promise<IMessageDocument[]>;
}
