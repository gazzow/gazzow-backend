import type {
  IAdminListProjectsRequestDTO,
  IAdminListProjectsResponseDTO,
} from "../../../dtos/admin/project.js";
import type { IProjectRepository } from "../../../interfaces/repository/project-repository.js";
import type { IAdminListProjectsUseCase } from "../../../interfaces/usecase/admin/project/list-projects.js";
import type { IProjectMapper } from "../../../mappers/project.js";

export class AdminListProjectsUseCase implements IAdminListProjectsUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper,
  ) {}
  async execute(
    query: IAdminListProjectsRequestDTO,
  ): Promise<IAdminListProjectsResponseDTO> {
    const { skip = 0, limit = 6, search, status, sortField, sortOrder } = query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { isDeleted: false };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;

    if (sortField) {
      sort[sortField] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const projects = await this._projectRepository.findAll({
      filter,
      limit,
      skip,
      sort,
    });

    const data = projects.map((project) => {
      return this._projectMapper.toResponseDTO(project);
    });

    const total = await this._projectRepository.count(filter);

    return { data, pagination: { skip, limit, total } };
  }
}
