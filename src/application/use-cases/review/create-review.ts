import type { PartialReview } from "../../../domain/entities/review.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { TaskStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import type { ICreateReviewRequestDTO } from "../../dtos/review.js";
import type { IReviewRepository } from "../../interfaces/repository/review.repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { ICreateReviewUseCase } from "../../interfaces/usecase/review/create-review.js";
import type { IReviewMapper } from "../../mappers/review.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class CreateReviewUseCase implements ICreateReviewUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper,
    private _reviewRepository: IReviewRepository,
    private _reviewMapper: IReviewMapper,
    // private _realtimeGateway: IRealtimeGateway,
    // private _notificationRepository: INotificationRepository,
    // private _notificationMapper: INotificationMapper,
  ) {}
  async execute(dto: ICreateReviewRequestDTO): Promise<void> {
    const taskDocument = await this._taskRepository.findById(dto.taskId);
    if (!taskDocument)
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND,
      );

    const task = this._taskMapper.toDomain(taskDocument);

    const existingReview = await this._reviewRepository.findReviewByTaskId(
      task.id,
    );

    if (existingReview) {
      throw new AppError(
        ResponseMessages.ReviewAlreadyExists,
        HttpStatusCode.CONFLICT,
      );
    }

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

    await this._reviewRepository.create(reviewPersistent);

    // update contributor review stats
  }
}
