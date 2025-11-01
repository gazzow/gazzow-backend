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
    const userExists = await this._userRepository.findById(dto.creatorId);
    if (!userExists) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const projectsDoc = await this._projectRepository.findByCreator(
      dto.creatorId
    );

    const data =
      projectsDoc?.map((doc) => {
        return this._projectMapper.toResponseDTO(doc);
      }) ?? [];

    return { data };
  }
}
