import express from "express";
import type { SocketGateway } from "../../infrastructure/config/socket/socket-gateway.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";
import { TeamChatDependencyContainer } from "../../infrastructure/dependency-injection/team-chat-container.js";

export const createTeamChatRoutes = (socketGateway: SocketGateway) => {
  const router = express.Router();

  const authContainer = new AuthDependencyContainer();
  const tokenMiddleware = authContainer.createTokenMiddleware();
  const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

  const teamChatContainer = new TeamChatDependencyContainer(socketGateway);

  const teamChatController = teamChatContainer.createTeamChatController();

  router.get(
    "/:projectId",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    teamChatController.listTeamMessages,
  );

  router.patch(
    "/:messageId/delete",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    teamChatController.deleteMessage,
  );

  return router;
};
