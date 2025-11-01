import { Types } from "mongoose";
import type {
  IListProjectRequestDTO,
  IListProjectResponseDTO,
} from "../../dtos/project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IListProjectUseCase } from "../../interfaces/usecase/project/list-projects.js";
import type { IProjectMapper } from "../../mappers/project.js";

export class ListProjectUseCase implements IListProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}
  async execute(dto: IListProjectRequestDTO): Promise<IListProjectResponseDTO> {
    const projects = await this._projectRepository.findAll({
      filter: {
        creatorId: { $ne: new Types.ObjectId(dto.userId) },
      },
    });
    const data = projects.map((project) => {
      return this._projectMapper.toResponseDTO(project);
    });

    return { data };
  }
}
