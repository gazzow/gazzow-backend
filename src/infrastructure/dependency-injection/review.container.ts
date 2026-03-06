import type { IReviewRepository } from "../../application/interfaces/repository/review.repository.js";
import type { ITaskRepository } from "../../application/interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../application/interfaces/repository/user-repository.js";
import type { ICreateReviewUseCase } from "../../application/interfaces/usecase/review/create-review.js";
import type { IListReviewsUseCase } from "../../application/interfaces/usecase/review/list-reviews.js";
import {
  ReviewMapper,
  type IReviewMapper,
} from "../../application/mappers/review.js";
import {
  TaskMapper,
  type ITaskMapper,
} from "../../application/mappers/task.js";
import {
  UserMapper,
  type IUserMapper,
} from "../../application/mappers/user/user.js";
import { CreateReviewUseCase } from "../../application/use-cases/review/create-review.js";
import { ListReviewsUseCase } from "../../application/use-cases/review/list-reviews.js";
import { ReviewController } from "../../presentation/controllers/review.controller.js";
import { ReviewModel } from "../db/models/review.model.js";
import { TaskModel } from "../db/models/task-model.js";
import { UserModel } from "../db/models/user-model.js";
import { ReviewRepository } from "../repositories/review.repository.js";
import { TaskRepository } from "../repositories/task-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

export class ReviewDependencyContainer {
  private readonly _taskRepository: ITaskRepository;
  private readonly _reviewRepository: IReviewRepository;
  private readonly _taskMapper: ITaskMapper;
  private readonly _reviewMapper: IReviewMapper;
  private readonly _userRepository: IUserRepository;
  private readonly _userMapper: IUserMapper;

  constructor() {
    this._taskRepository = new TaskRepository(TaskModel);
    this._taskMapper = new TaskMapper();
    this._reviewRepository = new ReviewRepository(ReviewModel);
    this._reviewMapper = new ReviewMapper();
    this._userRepository = new UserRepository(UserModel);
    this._userMapper = new UserMapper();
  }

  private createNewReviewUseCase(): ICreateReviewUseCase {
    return new CreateReviewUseCase(
      this._taskRepository,
      this._taskMapper,
      this._reviewRepository,
      this._reviewMapper,
      this._userRepository,
      this._userMapper,
    );
  }

  private createListReviewsUseCase(): IListReviewsUseCase {
    return new ListReviewsUseCase(this._reviewRepository, this._reviewMapper);
  }

  // Controller
  createReviewController(): ReviewController {
    return new ReviewController(
      this.createNewReviewUseCase(),
      this.createListReviewsUseCase(),
    );
  }
}
