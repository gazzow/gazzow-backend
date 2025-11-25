import type {
  IListContributorProjectRequestDTO,
  IListContributorProjectResponseDTO,
} from "../../dtos/contributor.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IListContributorProjectsUseCase } from "../../interfaces/usecase/project/list-contributor-projects.js";
import type { IProjectMapper } from "../../mappers/project.js";

export class ListContributorProjectsUseCase
  implements IListContributorProjectsUseCase
{
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}

  async execute(
    dto: IListContributorProjectRequestDTO
  ): Promise<IListContributorProjectResponseDTO> {
    const { skip = 0, limit = 6 } = dto;
    const { projects, total } =
      await this._projectRepository.findActiveProjects({
        ...dto,
      });

    const data = projects.map((doc) => {
      return this._projectMapper.toResponseDTO(doc);
    });

    return {
      data,
      pagination: {
        skip,
        limit,
        total,
      },
    };
  }
}
