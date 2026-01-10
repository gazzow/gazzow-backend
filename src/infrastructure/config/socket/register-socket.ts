import type { Server } from "socket.io";
import { SOCKET_EVENTS } from "../../../domain/types/socket-events.js";
import type { ISocketService } from "../../../application/providers/socket.service.js";

export const registerSocket = (
  io: Server,
  socketService: ISocketService
) => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    socket.on(SOCKET_EVENTS.JOIN_PROJECT, (payload) => {
      console.log("user joined on team chat");
      socketService.joinTeamChat(socket, payload.projectId);
    });

    socket.on(SOCKET_EVENTS.USER_ONLINE, (payload) => {
      console.log("user online: ", payload);
      socketService.joinUser(socket, payload.userId);
    });

    socket.on(
      SOCKET_EVENTS.SEND_MESSAGE,
      (data: { projectId: string; userId: string; content: string }) => {
        socketService.handleSendMessage(socket, data);
      }
    );

    socket.on(
      SOCKET_EVENTS.UPDATE_NOTIFICATION_COUNT,
      (data: { userId: string }) => {
        console.log("Updating notification count for user:", data.userId);
        socketService.handleNotificationCountUpdate(socket, data.userId);
      }
    );
  });
};
