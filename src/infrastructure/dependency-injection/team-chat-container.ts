import type { ITeamChatRepository } from "../../application/interfaces/repository/team-chat.repository.js";
import type { IListTeamChatMessagesUseCase } from "../../application/interfaces/usecase/team-chat/list-messages.js";
import {
  TeamChatMapper,
  type ITeamChatMapper,
} from "../../application/mappers/team-chat.js";
import { ListTeamChatMessagesUseCase } from "../../application/use-cases/team-chat/list-message.js";
import { TeamChatController } from "../../presentation/controllers/team-chat.controller.js";
import { TeamChatModel } from "../db/models/team-chat.model.js";
import { TeamChatRepository } from "../repositories/team-chat.repository.js";

export class TeamChatDependencyContainer {
  private readonly _teamChatRepository: ITeamChatRepository;
  private readonly _teamChatMapper: ITeamChatMapper;

  constructor() {
    this._teamChatRepository = new TeamChatRepository(TeamChatModel);
    this._teamChatMapper = new TeamChatMapper();
  }

  private createListTeamChatMessagesUseCase(): IListTeamChatMessagesUseCase {
    return new ListTeamChatMessagesUseCase(
      this._teamChatRepository,
      this._teamChatMapper
    );
  }

  //   Team Chat Controller
  createTeamChatController(): TeamChatController {
    return new TeamChatController(this.createListTeamChatMessagesUseCase());
  }
}
