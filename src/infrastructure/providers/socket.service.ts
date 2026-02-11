import type { Socket } from "socket.io";
import type { ISocketService } from "../../application/providers/socket.service.js";
import type { ISendTeamChatMessageRequestDTO } from "../../application/dtos/team-chat.js";
import type { ISendTeamChatMessageUseCase } from "../../application/interfaces/usecase/team-chat/send-message.js";

export class SocketService implements ISocketService {
  constructor(private _sendMessageUseCase: ISendTeamChatMessageUseCase) {}

  async handleSendMessage(
    socket: Socket,
    payload: { projectId: string; userId: string; content: string },
  ) {
    // Decode user data from Token from socket.data

    const dto: ISendTeamChatMessageRequestDTO = {
      projectId: payload.projectId,
      senderId: payload.userId,
      content: payload.content,
    };

    await this._sendMessageUseCase.execute(dto);
  }

  joinTeamChat(socket: Socket, projectId: string) {
    socket.join(projectId);
  }

  joinUser(socket: Socket, userId: string): void {
    socket.join(userId);
  }
}
