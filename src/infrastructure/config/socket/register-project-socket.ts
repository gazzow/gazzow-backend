import type { Server } from "socket.io";
import type { SocketService } from "../../providers/socket.service.js";
import { SOCKET_EVENTS } from "../../../domain/types/socket-events.js";

export const registerProjectSocket = (
  io: Server,
  socketService: SocketService
) => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    socket.on(SOCKET_EVENTS.JOIN_PROJECT, (payload) => {
      console.log("user joined on team chat");
      socketService.joinTeamChat(socket, payload.projectId);
    });

    socket.on(
      SOCKET_EVENTS.SEND_MESSAGE,
      (data: { projectId: string; userId: string; content: string }) => {
        socketService.handleSendMessage(socket, data);
      }
    );
  });
};
