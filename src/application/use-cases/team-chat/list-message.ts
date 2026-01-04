import type {
  IListTeamChatMessagesRequestDTO,
  IListTeamChatMessagesResponseDTO,
} from "../../dtos/team-chat.js";
import type { ITeamChatRepository } from "../../interfaces/repository/team-chat.repository.js";
import type { IListTeamChatMessagesUseCase } from "../../interfaces/usecase/team-chat/list-messages.js";
import type { ITeamChatMapper } from "../../mappers/team-chat.js";


export class ListTeamChatMessagesUseCase
  implements IListTeamChatMessagesUseCase
{
  constructor(
    private readonly _teamChatRepository: ITeamChatRepository,
    private readonly _teamChatMapper: ITeamChatMapper
  ) {}

  async execute(
    dto: IListTeamChatMessagesRequestDTO
  ): Promise<IListTeamChatMessagesResponseDTO> {
    const chatMessagesDocs = await this._teamChatRepository.findByProjectId(
      dto.projectId
    );

    const data = chatMessagesDocs.map((msg) =>
      this._teamChatMapper.toResponseDTO(msg)
    );

    return { data };
  }
}
