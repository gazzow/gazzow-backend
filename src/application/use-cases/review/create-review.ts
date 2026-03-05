import type { PartialReview } from "../../../domain/entities/review.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { TaskStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import type { ICreateReviewRequestDTO } from "../../dtos/review.js";
import type { IReviewRepository } from "../../interfaces/repository/review.repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { ICreateReviewUseCase } from "../../interfaces/usecase/review/create-review.js";
import type { IReviewMapper } from "../../mappers/review.js";
import type { ITaskMapper } from "../../mappers/task.js";
import type { IUserMapper } from "../../mappers/user/user.js";

export class CreateReviewUseCase implements ICreateReviewUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper,
    private _reviewRepository: IReviewRepository,
    private _reviewMapper: IReviewMapper,
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper,
  ) {}
  async execute(dto: ICreateReviewRequestDTO): Promise<void> {
    const taskDocument = await this._taskRepository.findById(dto.taskId);
    if (!taskDocument)
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND,
      );

    const task = this._taskMapper.toDomain(taskDocument);

    if (task.creatorId !== dto.userId)
      throw new AppError(
        ResponseMessages.UnauthorizedReviewCreation,
        HttpStatusCode.UNAUTHORIZED,
      );

    if (!task.assigneeId) {
      throw new AppError(
        ResponseMessages.AssigneeNotFound,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (task.status !== TaskStatus.COMPLETED) {
      throw new AppError(
        ResponseMessages.UnableToAddReview,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const existingReview = await this._reviewRepository.findReviewByTaskId(
      task.id,
    );

    if (existingReview) {
      throw new AppError(
        ResponseMessages.ReviewAlreadyExists,
        HttpStatusCode.CONFLICT,
      );
    }

    const createReviewPayload: PartialReview = {
      taskId: task.id,
      projectId: task.projectId,
      reviewerId: task.creatorId,
      contributorId: task.assigneeId,
      rating: dto.rating,
      review: dto.review,
    };

    const reviewPersistent =
      this._reviewMapper.toPersistentModel(createReviewPayload);

    const reviewDoc = await this._reviewRepository.create(reviewPersistent);
    const review = this._reviewMapper.toDomain(reviewDoc);

    const contributorDocument = await this._userRepository.findById(
      review.contributorId,
    );

    if (!contributorDocument) {
      throw new AppError(
        ResponseMessages.AssigneeNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }
    const contributor = this._userMapper.toPublicDTO(contributorDocument);

    const { reputation } = contributor;

    const newTotalReview = reputation.totalReviews + 1;
    
    const newAvgRating = Number(
      (
        (reputation.avgRating * reputation.totalReviews + review.rating) /
        newTotalReview
      ).toFixed(2),
    );

    await this._userRepository.update(review.contributorId, {
      reputation: {
        avgRating: newAvgRating,
        totalReviews: newTotalReview,
      },
    });
  }
}
