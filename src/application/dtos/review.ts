import type {
  IAggregatedReview,
} from "../../domain/entities/review.js";

export interface ICreateReviewRequestDTO {
  userId: string;
  taskId: string;
  rating: number;
  review: string;
}

export interface IListReviewsRequestDTO {
  userId: string;
}

export interface IListReviewsResponseDTO {
  data: IAggregatedReview[];
}
