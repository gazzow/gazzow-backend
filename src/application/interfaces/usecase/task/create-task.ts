import type { ICreateTaskRequestDTO, ICreateTaskResponseDTO } from "../../../dtos/task.js";

export interface ICreateTaskUseCase {
  execute(dto: ICreateTaskRequestDTO): Promise<ICreateTaskResponseDTO>;
}
