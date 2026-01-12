import { Server } from "socket.io";
import type {
  IMessage,
  INotificationPayload,
} from "../../../domain/entities/message.js";
import type { SocketEvent } from "../../../domain/types/socket-events.js";

export interface IRealtimeGateway {
  emitToProject(projectId: string, event: SocketEvent, data: IMessage): void;
  emitToUser(
    userId: string,
    event: SocketEvent,
    payload: INotificationPayload
  ): void;
}

export class SocketGateway implements IRealtimeGateway {
  constructor(private io: Server) {}

  emitToProject(projectId: string, event: SocketEvent, data: IMessage) {
    this.io.to(projectId).emit(event, data);
  }

  emitToUser(
    userId: string,
    event: SocketEvent,
    payload: INotificationPayload
  ) {
    this.io.to(userId).emit(event, payload);
  }
}
