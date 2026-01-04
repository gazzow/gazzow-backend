import type { IListTeamChatMessagesRequestDTO, IListTeamChatMessagesResponseDTO } from "../../../dtos/team-chat.js";

export interface IListTeamChatMessagesUseCase {
  execute(
    dto: IListTeamChatMessagesRequestDTO
  ): Promise<IListTeamChatMessagesResponseDTO>;
}
