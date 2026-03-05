import { Types } from "mongoose";
import type { IReview, PartialReview } from "../../domain/entities/review.js";
import type {
  IReviewDocument,
  PartialReviewDocument,
} from "../../infrastructure/db/models/review.model.js";

export interface IReviewMapper {
  toPersistentModel(data: PartialReview): PartialReviewDocument;
  toDomain(reviewDoc: IReviewDocument): IReview;
}

export class ReviewMapper implements IReviewMapper {
  toPersistentModel(data: PartialReview): PartialReviewDocument {
    const reviewDoc: PartialReviewDocument = {};

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
}
