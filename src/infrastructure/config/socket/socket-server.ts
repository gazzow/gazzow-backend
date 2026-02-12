import http from "http";
import { Server } from "socket.io";
import { env } from "../env.js";
import { SocketGateway } from "./socket-gateway.js";
import { SendProjectMessageUseCase } from "../../../application/use-cases/team-chat/send-message.js";
import { ProjectRepository } from "../../repositories/project-repository.js";
import { ProjectModel } from "../../db/models/project-model.js";
import { ProjectMapper } from "../../../application/mappers/project.js";
import { SocketService } from "../../providers/socket.service.js";
import { registerSocket } from "./register-socket.js";
import { TeamChatRepository } from "../../repositories/team-chat.repository.js";
import { TeamChatModel } from "../../db/models/team-chat.model.js";
import { TeamChatMapper } from "../../../application/mappers/team-chat.js";
import { UserRepository } from "../../repositories/user-repository.js";
import { UserModel } from "../../db/models/user-model.js";
import { UserMapper } from "../../../application/mappers/user/user.js";

export function createSocketServer(server: http.Server) {
  const io: Server = new Server(server, {
    cors: {
      origin: env.base_url,
      credentials: true,
    },
  });

  // 1. Validate Socket connection using JWT

  // 2. Create socket gateway
  const realtimeGateway = new SocketGateway(io);

  const projectRepository = new ProjectRepository(ProjectModel);
  const projectMapper = new ProjectMapper();
  const teamChatRepository = new TeamChatRepository(TeamChatModel);
  const teamChatMapper = new TeamChatMapper();
  const userRepository = new UserRepository(UserModel);
  const userMapper = new UserMapper();

  const sendMessageUseCase = new SendProjectMessageUseCase(
    projectRepository,
    projectMapper,
    teamChatRepository,
    teamChatMapper,
    userRepository,
    userMapper,
    realtimeGateway,
  );

  const socketService = new SocketService(sendMessageUseCase);

  registerSocket(io, socketService);

  return realtimeGateway; // return socket gateway
}
