import type {
  IGetTaskRequestDTO,
  IGetTaskResponseDTO,
} from "../../../dtos/task.js";

export interface IGetTaskUseCase {
  execute(dto: IGetTaskRequestDTO): Promise<IGetTaskResponseDTO>;
}
