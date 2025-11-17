import type { IAdminListProjectsResponseDTO } from "../../../dtos/admin/project.js";
import type { IProjectRepository } from "../../../interfaces/repository/project-repository.js";
import type { IAdminListProjectsUseCase } from "../../../interfaces/usecase/admin/project/list-projects.js";
import type { IProjectMapper } from "../../../mappers/project.js";

export class AdminListProjectsUseCase implements IAdminListProjectsUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}
  async execute(): Promise<IAdminListProjectsResponseDTO> {
    const projects = await this._projectRepository.findAll({});
    const data = projects.map((project) => {
      return this._projectMapper.toResponseDTO(project);
    });

    return { data };
  }
}
