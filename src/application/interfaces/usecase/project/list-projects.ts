import type { IListProjectResponseDTO } from "../../../dtos/project.js";

export interface IListProjectUseCase {
    execute(): Promise<IListProjectResponseDTO>
}