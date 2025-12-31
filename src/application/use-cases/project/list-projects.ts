import { TokenModel } from "../../../infrastructure/db/models/token-model.js";
import { PushService } from "../../../infrastructure/providers/push.service.js";
import { TokenRepository } from "../../../infrastructure/repositories/token-repository.js";
import type {
  IListProjectRequestDTO,
  IListProjectResponseDTO,
} from "../../dtos/project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IListProjectUseCase } from "../../interfaces/usecase/project/list-projects.js";
import { NotificationMapper } from "../../mappers/notification.js";
import type { IProjectMapper } from "../../mappers/project.js";

export class ListProjectUseCase implements IListProjectUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}

  async execute(dto: IListProjectRequestDTO): Promise<IListProjectResponseDTO> {
    const { skip = 0, limit = 6 }: IListProjectRequestDTO = dto;

    const { projects, total } =
      await this._projectRepository.findWithFilter(dto);

    const data = projects.map((doc) => {
      return this._projectMapper.toResponseDTO(doc);
    });

    return {
      data,
      pagination: { skip, limit, total },
    };
  }
}
