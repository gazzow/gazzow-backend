import express from "express";
import { FavoriteDependencyContainer } from "../../infrastructure/dependency-injection/favorite.container.js";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";

const authContainer = new AuthDependencyContainer();
const tokenMiddleware = authContainer.createTokenMiddleware();
const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

const favoriteContainer = new FavoriteDependencyContainer();
const favoriteController = favoriteContainer.createFavoriteController();

const router = express.Router();

router.post(
  "/",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  favoriteController.addProject
);

router.get(
  "/",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  favoriteController.listFavorites
);

router.delete(
  "/:projectId",
  tokenMiddleware.verifyToken,
  blockedUserMiddleware.isBlocked,
  favoriteController.removeFavorite
);

export default router;
