import type {
  IUpdateTaskRequestDTO,
  IUpdateTaskResponseDTO,
} from "../../../dtos/task.js";

export interface IUpdateTaskUseCase {
  execute(dto: IUpdateTaskRequestDTO): Promise<IUpdateTaskResponseDTO>;
}
