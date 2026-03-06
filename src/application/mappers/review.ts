import { Types } from "mongoose";
import type {
  IAggregatedReview,
  IPartialReview,
  IReview,
} from "../../domain/entities/review.js";
import type {
  IAggregatedReviewDocument,
  IPartialReviewDocument,
  IReviewDocument,
} from "../../infrastructure/db/models/review.model.js";

export interface IReviewMapper {
  toPersistentModel(data: IPartialReview): IPartialReviewDocument;
  toDomain(reviewDoc: IReviewDocument): IReview;
  toResponseDTO(reviewDoc: IReviewDocument): IReview;
  toAggregatedResponseDTO(
    aggregatedDoc: IAggregatedReviewDocument,
  ): IAggregatedReview;
}

export class ReviewMapper implements IReviewMapper {
  toPersistentModel(data: IPartialReview): IPartialReviewDocument {
    const reviewDoc: IPartialReviewDocument = {};

    if (data.taskId) reviewDoc.taskId = new Types.ObjectId(data.taskId);
    if (data.projectId)
      reviewDoc.projectId = new Types.ObjectId(data.projectId);
    if (data.reviewerId)
      reviewDoc.reviewerId = new Types.ObjectId(data.reviewerId);
    if (data.contributorId)
      reviewDoc.contributorId = new Types.ObjectId(data.contributorId);

    if (data.rating) reviewDoc.rating = data.rating;
    if (data.review) reviewDoc.review = data.review;

    return reviewDoc;
  }

  toDomain(reviewDoc: IReviewDocument): IReview {
    return {
      id: reviewDoc._id.toString(),
      taskId: reviewDoc.taskId.toString(),
      projectId: reviewDoc.projectId.toString(),
      reviewerId: reviewDoc.reviewerId.toString(),
      contributorId: reviewDoc.contributorId.toString(),
      rating: reviewDoc.rating,
      review: reviewDoc.review,
      isDeleted: reviewDoc.isDeleted,
      createdAt: reviewDoc.createdAt,
      updatedAt: reviewDoc.updatedAt,
    };
  }

  toResponseDTO(reviewDoc: IReviewDocument): IReview {
    return {
      id: reviewDoc._id.toString(),
      taskId: reviewDoc.taskId.toString(),
      projectId: reviewDoc.projectId.toString(),
      reviewerId: reviewDoc.reviewerId.toString(),
      contributorId: reviewDoc.contributorId.toString(),
      rating: reviewDoc.rating,
      review: reviewDoc.review,
      isDeleted: reviewDoc.isDeleted,
      createdAt: reviewDoc.createdAt,
      updatedAt: reviewDoc.updatedAt,
    };
  }

  toAggregatedResponseDTO(
    aggregatedDoc: IAggregatedReviewDocument,
  ): IAggregatedReview {
    return {
      id: aggregatedDoc._id.toString(),
      rating: aggregatedDoc.rating,
      review: aggregatedDoc.review,
      reviewer: {
        id: aggregatedDoc.reviewer.id.toString(),
        name: aggregatedDoc.reviewer.name,
      },
      task: {
        id: aggregatedDoc.task.id.toString(),
        title: aggregatedDoc.task.title,
        status: aggregatedDoc.task.status,
      },
    };
  }
}
