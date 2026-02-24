import { Server } from "socket.io";
import type {
  IDeletedMessageSocketPayload,
  IMessage,
  INotificationPayload,
  ITaskCommentNotificationPayload,
  ITaskUpdateNotificationPayload,
} from "../../../domain/entities/message.js";
import {
  SOCKET_EVENTS,
  type SocketEvent,
} from "../../../domain/types/socket-events.js";

export interface IRealtimeGateway {
  emitToProject(
    projectId: string,
    event: SocketEvent,
    payload: IMessage | IDeletedMessageSocketPayload,
  ): void;
  emitToUser(
    userId: string,
    event: SocketEvent,
    payload:
      | INotificationPayload
      | ITaskCommentNotificationPayload
      | ITaskUpdateNotificationPayload,
  ): void;

  updateNotificationCount(userId: string, count: number): void;
}

export class SocketGateway implements IRealtimeGateway {
  constructor(private io: Server) {}

  emitToProject(
    projectId: string,
    event: SocketEvent,
    payload: IMessage | IDeletedMessageSocketPayload,
  ) {
    this.io.to(projectId).emit(event, payload);
  }

  emitToUser(
    userId: string,
    event: SocketEvent,
    payload:
      | INotificationPayload
      | ITaskCommentNotificationPayload
      | ITaskUpdateNotificationPayload,
  ) {
    this.io.to(userId).emit(event, payload);
  }

  updateNotificationCount(userId: string, count: number): void {
    this.io.to(userId).emit(SOCKET_EVENTS.NOTIFICATION_COUNT, { count });
  }
}
