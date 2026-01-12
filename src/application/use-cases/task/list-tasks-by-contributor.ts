import logger from "../../../utils/logger.js";
import type {
  IListTasksByContributorRequestDTO,
  IPopulatedResponseDTO,
} from "../../dtos/task.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IListTasksByContributorUseCase } from "../../interfaces/usecase/task/list-tasks-by-contributor.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class ListTasksByContributorUseCase
  implements IListTasksByContributorUseCase
{
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper
  ) {}
  async execute(
    dto: IListTasksByContributorRequestDTO
  ): Promise<IPopulatedResponseDTO[]> {
    logger.debug(`List contributor dto: ${JSON.stringify(dto)}`);

    const taskDocs = await this._taskRepository.findByProjectAndUser({
      filter: { projectId: dto.projectId, assigneeId: dto.userId },
    });
    const data = taskDocs.map((task) => this._taskMapper.toPopulatedResponseDTO(task));
    logger.debug(`contributor tasks: ${data[0]}`);
    return data ;
  }
}
