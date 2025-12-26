import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  IUpdateContributorStatusRequestDTO,
  IUpdateContributorStatusResponseDTO,
} from "../../dtos/contributor.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IProjectMapper } from "../../mappers/project.js";
import type { ITaskMapper } from "../../mappers/task.js";

export interface IUpdateContributorStatusUseCase {
  execute(
    dto: IUpdateContributorStatusRequestDTO
  ): Promise<IUpdateContributorStatusResponseDTO>;
}

export class UpdateContributorStatusUseCase
  implements IUpdateContributorStatusUseCase
{
  constructor(
    private _projectRepository: IProjectRepository,
    private _taskRepository: ITaskRepository,
    private _projectMapper: IProjectMapper,
    private _taskMapper: ITaskMapper
  ) {}

  async execute(
    dto: IUpdateContributorStatusRequestDTO
  ): Promise<IUpdateContributorStatusResponseDTO> {
    const projectDoc = await this._projectRepository.findById(dto.projectId);

    if (!projectDoc) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const project = this._projectMapper.toDomain(projectDoc);

    const isValidContributor = project.contributors.some(
      (c) => c.userId === dto.contributorId
    );

    if (!isValidContributor) {
      throw new AppError(
        ResponseMessages.ContributorNotFoundInProject,
        HttpStatusCode.BAD_REQUEST
      );
    }

    // find task has not start working  and update it as unassigned for
    const taskDocs = await this._taskRepository.findByAssigneeId(
      dto.contributorId
    );

    if (taskDocs && taskDocs.length === 0) {
      logger.info(`Contributor status updating to [${dto.status}]`);
      const updatedProject =
        await this._projectRepository.findContributorAndUpdateStatus(
          dto.projectId,
          dto.contributorId,
          dto.status
        );

      if (!updatedProject) {
        throw new AppError(
          "Contributor Status update failed",
          HttpStatusCode.BAD_REQUEST
        );
      }

      const project = this._projectMapper.toResponseDTO(updatedProject);
      return { data: project };
    } else {
      throw new AppError(
        "Contributor is currently assigned to active tasks",
        HttpStatusCode.CONFLICT
      );
    }
  }
}
