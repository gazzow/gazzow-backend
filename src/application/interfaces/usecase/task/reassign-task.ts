import type {
  IReassignTaskRequestDTO,
  IReassignTaskResponseDTO,
} from "../../../dtos/task.js";

export interface IReassignTaskUseCase {
  execute(dto: IReassignTaskRequestDTO): Promise<IReassignTaskResponseDTO>;
}
