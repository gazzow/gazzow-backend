import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type { IListContributorsRequestDTO, IListContributorsResponseDTO } from "../../dtos/project.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { IListContributorsUseCase } from "../../interfaces/usecase/project/list-contributors.js";
import type { IProjectMapper } from "../../mappers/project.js";

export class ListContributorsUseCase implements IListContributorsUseCase {
  constructor(
    private _projectRepository: IProjectRepository,
    private _projectMapper: IProjectMapper
  ) {}
  async execute(dto: IListContributorsRequestDTO): Promise<IListContributorsResponseDTO> {
    logger.debug(`List contributors DTO: ${dto.projectId}`);

    const projectDoc = await this._projectRepository.findContributors(dto.projectId);
    if (!projectDoc) {
      throw new AppError(
        ResponseMessages.ProjectNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const data = this._projectMapper.toListContributorsResponseDTO(projectDoc);

    return data;
  }
}
