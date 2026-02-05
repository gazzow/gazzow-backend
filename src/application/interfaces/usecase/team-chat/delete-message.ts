import type { IDeleteTeamChatMessageRequestDTO } from "../../../dtos/team-chat.js";

export interface IDeleteTeamChatMessageUseCase {
  execute(dto: IDeleteTeamChatMessageRequestDTO): Promise<void>;
}
