import express from "express";
import { ContributorDependencyContainer } from "../../infrastructure/dependency-injection/contributor-dependency-container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";

const router = express.Router();

const contributorContainer = new ContributorDependencyContainer();
const authContainer = new AuthDependencyContainer();

const tokenMiddleware = authContainer.createTokenMiddleware();
const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

const contributionController =
  contributorContainer.createContributorController();

router.get(
  "/active",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  contributionController.getContributorProjects
);

router.get(
  "/applications",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  contributionController.getContributorProposals
);

export default router;
