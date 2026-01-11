import express from "express";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";
import { TeamChatDependencyContainer } from "../../infrastructure/dependency-injection/team-chat-container.js";

const router = express.Router();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();
const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

const teamChatContainer = new TeamChatDependencyContainer();
const teamChatController = teamChatContainer.createTeamChatController();

router.get(
  "/:projectId",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  teamChatController.listTeamMessages
);

export default router;
