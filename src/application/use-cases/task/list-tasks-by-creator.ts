import logger from "../../../utils/logger.js";
import type {
  IListTasksByCreatorRequestDTO,
  IPopulatedResponseDTO,
} from "../../dtos/task.js";
import type { ITaskRepository } from "../../interfaces/repository/task-repository.js";
import type { IListTasksByCreatorUseCase } from "../../interfaces/usecase/task/list-tasks-by-creator.js";
import type { ITaskMapper } from "../../mappers/task.js";

export class ListTasksByCreatorUseCase implements IListTasksByCreatorUseCase {
  constructor(
    private _taskRepository: ITaskRepository,
    private _taskMapper: ITaskMapper
  ) {}
  async execute(
    dto: IListTasksByCreatorRequestDTO
  ): Promise<IPopulatedResponseDTO[]> {
    logger.debug(`dto: ${JSON.stringify(dto)}`);
    const taskDocs = await this._taskRepository.findByProjectAndUser({
      filter: { projectId: dto.projectId, creatorId: dto.userId },
    });

    const data = taskDocs.map((task) =>
      this._taskMapper.toPopulatedResponseDTO(task)
    );
    logger.debug(`creator tasks: ${data[0]}`);
    return data;
  }
}
