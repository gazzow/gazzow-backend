import express from "express";
import { ContributorDependencyContainer } from "../../infrastructure/dependency-injection/contributor-dependency-container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";

const router = express.Router();

const contributorContainer = new ContributorDependencyContainer();
const authContainer = new AuthDependencyContainer();

const tokenMiddleware = authContainer.createTokenMiddleware();
const contributionController =
  contributorContainer.createContributorController();

router.get(
  "/active",
  tokenMiddleware.verifyToken,
  contributionController.getContributorProjects
);

router.get(
  "/applications",
  tokenMiddleware.verifyToken,
  contributionController.getContributorProposals
);

export default router;
