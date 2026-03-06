import express from "express";
import { AuthDependencyContainer } from "../../infrastructure/dependency-injection/auth-dependency-container.js";
import { ReviewDependencyContainer } from "../../infrastructure/dependency-injection/review.container.js";

export const createReviewRoutes = () => {
  const authContainer = new AuthDependencyContainer();
  const tokenMiddleware = authContainer.createTokenMiddleware();
  const blockedUserMiddleware = authContainer.createBlockedUserMiddleware();

  const reviewContainer = new ReviewDependencyContainer();
  const reviewController = reviewContainer.createReviewController();

  const router = express.Router();

  router.post(
    "/",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    reviewController.createReview,
  );

  router.get(
    "/",
    tokenMiddleware.verifyToken,
    blockedUserMiddleware.isBlocked,
    reviewController.listReviews,
  );

  return router;
};
