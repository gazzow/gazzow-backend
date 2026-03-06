import type {
  IListReviewsRequestDTO,
  IListReviewsResponseDTO,
} from "../../dtos/review.js";
import type { IReviewRepository } from "../../interfaces/repository/review.repository.js";
import type { IListReviewsUseCase } from "../../interfaces/usecase/review/list-reviews.js";
import type { IReviewMapper } from "../../mappers/review.js";

export class ListReviewsUseCase implements IListReviewsUseCase {
  constructor(
    private _reviewRepository: IReviewRepository,
    private _reviewMapper: IReviewMapper,
  ) {}

  async execute(dto: IListReviewsRequestDTO): Promise<IListReviewsResponseDTO> {
    const reviewDocs = await this._reviewRepository.findReviewByContributorId(
      dto.userId,
    );

    const reviews = reviewDocs.map((review) =>
      this._reviewMapper.toAggregatedResponseDTO(review),
    );

    return { data: reviews };
  }
}
