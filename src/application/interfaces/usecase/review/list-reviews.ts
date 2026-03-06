import type {
  IListReviewsRequestDTO,
  IListReviewsResponseDTO,
} from "../../../dtos/review.js";

export interface IListReviewsUseCase {
  execute(dto: IListReviewsRequestDTO): Promise<IListReviewsResponseDTO>;
}
