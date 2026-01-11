import type {
  IListCompletedContributionsRequestDTO,
  IListCompletedContributionsResponseDTO,
} from "../../dtos/project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IListCompletedContributionsUseCase } from "../../interfaces/usecase/project/list-completed-contributions.js";
import type { IProjectMapper } from "../../mappers/project.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class ListCompletedContributionsUseCase
  implements IListCompletedContributionsUseCase
{
  constructor(
    private _projectRepository: IProjectRepository,
    private _taskRepository: ITaskRepository,
    private _projectMapper: IProjectMapper,
    private _taskMapper: ITaskMapper
  ) {}
  async execute(
    dto: IListCompletedContributionsRequestDTO
  ): Promise<IListCompletedContributionsResponseDTO> {
    const { userId } = dto;
    const taskDocs =
      await this._taskRepository.getCompletedTaskByAssigneeId(userId);

    const projectIds = this._taskMapper.getCompletedTaskProjectIds(taskDocs);

    const projects = await this._projectRepository.findByProjectIds(projectIds);

    const data = projects.map((project) =>
      this._projectMapper.toResponseDTO(project)
    );

    return { data };
  }
}
