import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import type { IAdminDeleteProjectRequestDTO } from "../../../dtos/admin/project.js";

import type { IProjectRepository } from "../../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../../interfaces/repository/task-repository.js";
import type { IAdminDeleteProjectUseCase } from "../../../interfaces/usecase/admin/project/delete-project.js";
import type { IProjectMapper } from "../../../mappers/project.js";

export class AdminDeleteProjectUseCase implements IAdminDeleteProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper,
    private _taskRepository: ITaskRepository,
  ) {}

  async execute(dto: IAdminDeleteProjectRequestDTO): Promise<void> {
    const projectDocument = await this._projectRepository.findById(
      dto.projectId,
    );
    if (!projectDocument) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const project = this._projectMapper.toDomain(projectDocument);

    if (project.isDeleted) {
      throw new AppError(
        ResponseMessages.ProjectAlreadyDeleted,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const activeTaskExists = await this._taskRepository.existsActiveTask(
      project.id,
    );

    console.log(activeTaskExists)
    if (activeTaskExists) {
      throw new AppError(
        ResponseMessages.UnableToDeleteProjectWithActiveTasks,
        HttpStatusCode.CONFLICT,
      );
    }

    const isDeleted = await this._projectRepository.softDelete(project.id);
    if (!isDeleted) {
      throw new AppError(
        ResponseMessages.ProjectDeleteFailed,
        HttpStatusCode.BAD_REQUEST,
      );
    }
  }
}
