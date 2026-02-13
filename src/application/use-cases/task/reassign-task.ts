import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { TaskRules } from "../../../domain/rules/task-rules.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  IReassignTaskRequestDTO,
  IReassignTaskResponseDTO,
} from "../../dtos/task.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IReassignTaskUseCase } from "../../interfaces/usecase/task/reassign-task.js";
import type { IProjectMapper } from "../../mappers/project.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class ReassignTaskUseCase implements IReassignTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper,
    private _taskMapper: ITaskMapper,
  ) {}

  async execute(
    dto: IReassignTaskRequestDTO,
  ): Promise<IReassignTaskResponseDTO> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const task = this._taskMapper.toDomain(taskDoc);

    // Validate project ownership (project & user) - pending
    if (!TaskRules.isTaskCreator(task.creatorId, dto.userId))
      throw new AppError(
        ResponseMessages.UnauthorizedTaskModification,
        HttpStatusCode.FORBIDDEN,
      );

    if (dto.assigneeId === task.assigneeId) {
      throw new AppError(
        ResponseMessages.TaskAlreadyAssignedToUser,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (TaskRules.hasWorkStarted(task.status)) {
      throw new AppError(
        ResponseMessages.UnableToReassignTaskWhileInProgress,
        HttpStatusCode.FORBIDDEN,
      );
    }

    if (!TaskRules.canReassign(task.assigneeStatus)) {
      throw new AppError(
        ResponseMessages.CannotReassignWithoutAssignee,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // check new assignee is a valid contributor of this project
    const populatedProjectDoc = await this._projectRepository.findContributors(
      task.projectId,
    );

    if (!populatedProjectDoc) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const contributorDoc = populatedProjectDoc.contributors;

    const contributors = contributorDoc.map((c) => {
      return this._projectMapper.toListContributorsEntity(c);
    });

    const contributor = TaskRules.getValidContributor(
      dto.assigneeId,
      contributors,
    );

    if (!contributor) {
      throw new AppError(
        ResponseMessages.UserIsNotAProjectContributor,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // Create activity history - pending

    // Handle Financial
    const currentRate = contributor.expectedRate;
    const newTotal = task.estimatedHours * currentRate;

    const reCalculatedFinancial = TaskRules.reCalculateFinancial(
      newTotal,
      task,
    );

    // Reassign
    const updatePersistent = this._taskMapper.toReassignPersistent({
      assigneeId: dto.assigneeId,
      expectedRate: currentRate,
      totalAmount: newTotal,
      ...reCalculatedFinancial,
    });

    logger.debug(`update persistent: ${JSON.stringify(updatePersistent)}`);

    const updatedTaskDoc = await this._taskRepository.update(
      task.id,
      updatePersistent,
    );

    if (!updatedTaskDoc) {
      throw new AppError(
        ResponseMessages.TaskUpdateFailed,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const data = this._taskMapper.toResponseDTO(updatedTaskDoc);

    return {
      data,
    };
  }
}
