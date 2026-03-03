import { Types } from "mongoose";
import type { PartialReview } from "../../domain/entities/review.js";
import type { PartialReviewDocument } from "../../infrastructure/db/models/review.model.js";

export interface IReviewMapper {
  toPersistentModel(data: PartialReview): PartialReviewDocument;
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
}
