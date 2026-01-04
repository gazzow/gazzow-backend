import type { ISendTeamChatMessageRequestDTO } from "../../../dtos/team-chat.js";

export interface ISendTeamChatMessageUseCase {
  execute(dto: ISendTeamChatMessageRequestDTO): Promise<void>;
}
