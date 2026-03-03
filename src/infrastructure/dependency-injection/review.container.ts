import type { IReviewRepository } from "../../application/interfaces/repository/review.repository.js";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type { ICreateReviewUseCase } from "../../application/interfaces/usecase/review/create-review.js";
import {
  ReviewMapper,
  type IReviewMapper,
} from "../../application/mappers/review.js";
import {
  TaskMapper,
  type ITaskMapper,
} from "../../application/mappers/task.js";
import { CreateReviewUseCase } from "../../application/use-cases/review/create-review.js";
import { ReviewController } from "../../presentation/controllers/review.controller.js";
import { ReviewModel } from "../db/models/review.model.js";
import { TaskModel } from "../db/models/task-model.js";
import { ReviewRepository } from "../repositories/review.repository.js";
import { TaskRepository } from "../repositories/task-repository.js";

export class ReviewDependencyContainer {
  private readonly _taskRepository: ITaskRepository;
  private readonly _reviewRepository: IReviewRepository;
  private readonly _taskMapper: ITaskMapper;
  private readonly _reviewMapper: IReviewMapper;

  constructor() {
    this._taskRepository = new TaskRepository(TaskModel);
    this._taskMapper = new TaskMapper();
    this._reviewRepository = new ReviewRepository(ReviewModel);
    this._reviewMapper = new ReviewMapper();
  }

  private createNewReviewUseCase(): ICreateReviewUseCase {
    return new CreateReviewUseCase(
      this._taskRepository,
      this._taskMapper,
      this._reviewRepository,
      this._reviewMapper,
    );
  }

  // Controller
  createReviewController(): ReviewController {
    return new ReviewController(this.createNewReviewUseCase());
  }
}
