import type { Socket } from "socket.io";

export interface ISocketService {
  handleSendMessage(
    socket: Socket,
    payload: { projectId: string; userId: string; content: string }
  ): Promise<void>;

  joinTeamChat(socket: Socket, projectId: string): void;

  joinUser(socket: Socket, userId: string): void
}
