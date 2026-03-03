import type { ICreateReviewRequestDTO } from "../../../dtos/review.js";

export interface ICreateReviewUseCase {
  execute(dto: ICreateReviewRequestDTO): Promise<void>;
}


