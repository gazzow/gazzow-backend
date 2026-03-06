import type { IAggregatedReviewDocument, IReviewDocument } from "../../../infrastructure/db/models/review.model.js";
import type { IBaseRepository } from "./base-repository.js";

export interface IReviewRepository extends IBaseRepository<IReviewDocument> {
  findReviewByTaskId(taskId: string): Promise<IReviewDocument | null>;
  findReviewByContributorId(contributorId: string): Promise<IAggregatedReviewDocument[]>;
}
