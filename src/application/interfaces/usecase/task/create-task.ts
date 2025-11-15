import type { ICreateTaskRequestDTO } from "../../../dtos/task.js";

export interface ICreateTaskUseCase {
  execute(dto: ICreateTaskRequestDTO): Promise<void>;
}
