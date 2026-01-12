import type { ICompleteTaskRequestDTO } from "../../../dtos/task.js";

export interface ICompleteTaskUseCase {
  execute(dto: ICompleteTaskRequestDTO): Promise<void>;
}