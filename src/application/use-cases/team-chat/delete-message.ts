import type { IDeletedMessageSocketPayload } from "../../../domain/entities/message.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { SOCKET_EVENTS } from "../../../domain/types/socket-events.js";
import type { IRealtimeGateway } from "../../../infrastructure/config/socket/socket-gateway.js";
import { AppError } from "../../../utils/app-error.js";
import type { IDeleteTeamChatMessageRequestDTO } from "../../dtos/team-chat.js";
import type { ITeamChatRepository } from "../../interfaces/repository/team-chat.repository.js";
import type { IDeleteTeamChatMessageUseCase } from "../../interfaces/usecase/team-chat/delete-message.js";
import type { ITeamChatMapper } from "../../mappers/team-chat.js";

export class DeleteTeamChatMessageUseCase
  implements IDeleteTeamChatMessageUseCase
{
  constructor(
    private readonly _teamChatRepository: ITeamChatRepository,
    private readonly _teamChatMapper: ITeamChatMapper,
    private readonly _realTimeGateway: IRealtimeGateway,
  ) {}
  async execute(dto: IDeleteTeamChatMessageRequestDTO): Promise<void> {
    if (dto.type === "FOR_ME") {
      const updated = await this._teamChatRepository.addToDeletedFor(
        dto.messageId,
        dto.userId,
      );

      if (updated) return;

      throw new AppError(
        ResponseMessages.MessageAlreadyDeleted,
        HttpStatusCode.CONFLICT,
      );
    } else if (dto.type === "FOR_EVERYONE") {
      const updated = await this._teamChatRepository.markDeletedForEveryone(
        dto.messageId,
        dto.userId,
      );

      if (!updated)
        throw new AppError(
          ResponseMessages.UnauthorizedToDeleteMessage,
          HttpStatusCode.FORBIDDEN,
        );

      const message = this._teamChatMapper.toEntity(updated);
      const socketPayload: IDeletedMessageSocketPayload = {
        messageId: message.id,
        userId: dto.userId,
        type: dto.type,
      };

      this._realTimeGateway.emitToProject(
        message.projectId,
        SOCKET_EVENTS.TEAM_MESSAGE_DELETED,
        socketPayload,
      );
    }
  }
}
