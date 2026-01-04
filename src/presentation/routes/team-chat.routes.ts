import express from "express";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";
import { TeamChatDependencyContainer } from "../../infrastructure/dependency-injection/team-chat-container.js";

const router = express.Router();

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();

const teamChatContainer = new TeamChatDependencyContainer();
const teamChatController = teamChatContainer.createTeamChatController();

router.get(
  "/:projectId",
  tokenMiddleware.verifyToken,
  teamChatController.listTeamMessages
);

export default router;
