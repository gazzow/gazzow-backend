import type { Model } from "mongoose";
import type { IReviewRepository } from "../../application/interfaces/repository/review.repository.js";
import type { IReviewDocument } from "../db/models/review.model.js";
import { BaseRepository } from "./base/base-repository.js";

export class ReviewRepository
  extends BaseRepository<IReviewDocument>
  implements IReviewRepository
{
  constructor(model: Model<IReviewDocument>) {
    super(model);
  }

  findReviewByTaskId(taskId: string): Promise<IReviewDocument | null> {
    return this.model.findOne({ taskId });
  }

  findReviewByContributorId(contributorId: string): Promise<IReviewDocument[]> {
    return this.model.find({ contributorId });
  }
}
