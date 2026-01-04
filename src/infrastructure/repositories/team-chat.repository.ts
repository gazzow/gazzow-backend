import type { Model } from "mongoose";
import type { IMessageDocument } from "../db/models/team-chat.model.js";
import { BaseRepository } from "./base/base-repository.js";
import type { ITeamChatRepository } from "../../application/interfaces/repository/team-chat.repository.js";


export class TeamChatRepository
  extends BaseRepository<IMessageDocument>
  implements ITeamChatRepository
{
  constructor(model: Model<IMessageDocument>) {
    super(model);
  }

  findByProjectId(projectId: string): Promise<IMessageDocument[]> {
    return this.model.find({ projectId });
  }
}
