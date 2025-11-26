import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IListMyProjectRequestDTO,
  IListMyProjectsResponseDTO,
} from "../../dtos/project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { IListMyProjectsUsecase } from "../../interfaces/usecase/project/list-my-projects.js";
import type { IProjectMapper } from "../../mappers/project.js";

export class ListMyProjectsUseCase implements IListMyProjectsUsecase {
  constructor(
    private _userRepository: IUserRepository,
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}
  async execute(
    dto: IListMyProjectRequestDTO
  ): Promise<IListMyProjectsResponseDTO> {
    const { creatorId, skip = 0, limit = 6 } = dto;

    const userExists = await this._userRepository.findById(creatorId);
    if (!userExists) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const { projects, total } =
      await this._projectRepository.findByCreatorWithFilter(dto);

    const data = projects?.map((doc) => {
      return this._projectMapper.toResponseDTO(doc);
    });

    return { data, pagination: { total, skip, limit } };
  }
}
