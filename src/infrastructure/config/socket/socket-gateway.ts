import { Server } from "socket.io";
import type { IMessage } from "../../../domain/entities/message.js";
import type { SocketEvent } from "../../../domain/types/socket-events.js";

export interface IRealtimeGateway {
  emitToProject(projectId: string, event: SocketEvent, data: IMessage): void;
  emitToUser(userId: string, event: SocketEvent, data: string): void;
}

export class SocketGateway implements IRealtimeGateway {
  constructor(private io: Server) {}

  emitToProject(projectId: string, event: SocketEvent, data: IMessage) {
    this.io.to(projectId).emit(event, data);
  }

  emitToUser(userId: string, event: SocketEvent, data: string) {
    this.io.to(userId).emit(event, data);
  }
}
