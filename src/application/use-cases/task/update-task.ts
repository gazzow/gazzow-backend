import type { Contributor } from "../../../domain/entities/project.js";
import type { ITask } from "../../../domain/entities/task.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { TaskRules } from "../../../domain/rules/task-rules.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  IUpdateTaskRequestDTO,
  IUpdateTaskResponseDTO,
} from "../../dtos/task.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IUpdateTaskUseCase } from "../../interfaces/usecase/task/update-task.js";
import type { IProjectMapper } from "../../mappers/project.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class UpdateTaskUseCase implements IUpdateTaskUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper,
    private _taskMapper: ITaskMapper
  ) {}
  async execute(dto: IUpdateTaskRequestDTO): Promise<IUpdateTaskResponseDTO> {
    const taskDoc = await this._taskRepository.findById(dto.taskId);
    if (!taskDoc) {
      throw new AppError(
        ResponseMessages.TaskNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    logger.debug(`update dto: ${JSON.stringify(dto)}`);
    const task = this._taskMapper.toDomain(taskDoc);

    if (!TaskRules.isTaskCreator(task.creatorId, dto.userId))
      throw new AppError(
        ResponseMessages.UnauthorizedTaskModification,
        HttpStatusCode.FORBIDDEN
      );

    if (TaskRules.hasWorkStarted(task.status))
      throw new AppError(
        ResponseMessages.UnableToUpdateTaskWhileInProgress,
        HttpStatusCode.CONFLICT
      );

    const { estimatedHours } = dto.data;

    let reCalculatedFinancial: Partial<ITask> = {};
    let contributor: Contributor | null = null;
    let currentRate: number = task.expectedRate;

    // check new assignee is a valid contributor of this project

    if (dto.data.assigneeId && dto.data.assigneeId !== task.assigneeId) {
      if (task.assigneeId) {
        throw new AppError(
          ResponseMessages.UseReassignOptionToChangeAssignee,
          HttpStatusCode.BAD_REQUEST
        );
      }
      logger.info("Adding assignee to this task");
      const populatedProjectDoc =
        await this._projectRepository.findContributors(task.projectId);

      if (!populatedProjectDoc) {
        throw new AppError(
          ResponseMessages.ProjectNotFound,
          HttpStatusCode.NOT_FOUND
        );
      }

      const contributorDoc = populatedProjectDoc.contributors;

      const contributors = contributorDoc.map((c) => {
        return this._projectMapper.toListContributorsEntity(c);
      });

      contributor = TaskRules.getValidContributor(
        dto.data.assigneeId,
        contributors
      );

      if (!contributor) {
        throw new AppError(
          ResponseMessages.UserIsNotAProjectContributor,
          HttpStatusCode.BAD_REQUEST
        );
      }

      logger.info("Amount changed due to new assignee, update payment status");
      //  Recalculate if assignee changed
      currentRate = contributor.expectedRate;
      const newTotal = task.estimatedHours * currentRate;
      reCalculatedFinancial = TaskRules.reCalculateFinancial(newTotal, task);
    }

    if (
      estimatedHours !== undefined &&
      estimatedHours !== task.estimatedHours
    ) {
      logger.info("Amount changed due to updated hours, update payment status");
      if (estimatedHours <= 0) {
        throw new AppError(
          "Invalid estimated hours",
          HttpStatusCode.BAD_REQUEST
        );
      }
      // Recalculate if hours changed
      const newTotal = estimatedHours * currentRate;
      reCalculatedFinancial = TaskRules.reCalculateFinancial(newTotal, task);
    }

    const taskUpdates: Partial<ITask> = {
      ...dto.data,
      ...reCalculatedFinancial,
      expectedRate: currentRate,
    };

    // Create log & notify user for rate changes
    logger.debug(`task updates : ${JSON.stringify(taskUpdates)}`);

    const persistenceModel = this._taskMapper.toUpdatePersistent(taskUpdates);
    logger.debug(`task updates model : ${JSON.stringify(persistenceModel)}`);

    const updatedTaskDoc = await this._taskRepository.update(
      dto.taskId,
      persistenceModel
    );

    if (!updatedTaskDoc) {
      throw new AppError(
        ResponseMessages.TaskUpdateFailed,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const data = this._taskMapper.toResponseDTO(updatedTaskDoc);

    return { data };
  }
}
