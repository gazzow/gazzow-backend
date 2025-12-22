import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { TaskStatus } from "../../../domain/enums/task.js";
import { AppError } from "../../../utils/app-error.js";
import type { IStartWorkRequestDTO } from "../../dtos/task.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { IStartWorkUseCase } from "../../interfaces/usecase/task/start-task.js";
import type { ITaskMapper } from "../../mappers/task.js";
import type { IUserMapper } from "../../mappers/user/user.js";
import type { IStripeService } from "../../providers/stripe-service.js";

export class StartWorkUseCase implements IStartWorkUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _userRepository: IUserRepository,
    private _taskMapper: ITaskMapper,
    private _userMapper: IUserMapper,
    private _stripeService: IStripeService
  ) {}

  async execute(dto: IStartWorkRequestDTO): Promise<void> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc)
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const task = this._taskMapper.toResponseDTO(taskDoc);

    if (!task.assigneeId)
      throw new AppError(
        ResponseMessages.AssigneeIdIsRequired,
        HttpStatusCode.BAD_REQUEST
      );

    const userDoc = await this._userRepository.findById(task.assigneeId);
    if (!userDoc)
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const user = this._userMapper.toPublicDTO(userDoc);
    if (!user.stripeAccountId) {
      throw new AppError(
        ResponseMessages.StripeAccountIdNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    // Check account onboarding status
    const isOnboarded = await this._stripeService.checkOnboardingStatus(
      user.stripeAccountId
    );
    if (!isOnboarded)
      throw new AppError(
        ResponseMessages.StripeAccountOnboardingIncomplete,
        HttpStatusCode.BAD_REQUEST
      );

    if (task.status !== TaskStatus.TODO) {
      throw new AppError(
        ResponseMessages.UnableToStartTask,
        HttpStatusCode.CONFLICT
      );
    }

    await this._taskRepository.update(dto.taskId, {
      status: TaskStatus.IN_PROGRESS,
      acceptedAt: new Date(dto.time),
    });
  }
}
