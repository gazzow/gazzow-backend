import type { IStartWorkRequestDTO } from "../../../dtos/task.js";

export interface IStartWorkUseCase{
    execute(dto: IStartWorkRequestDTO): Promise<void>
}