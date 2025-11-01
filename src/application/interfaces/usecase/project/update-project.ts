import type { IUpdateProjectRequestDTO, IUpdateProjectResponseDTO, } from "../../../dtos/project.js";


export interface IUpdateProjectUseCase{
    execute(dto: IUpdateProjectRequestDTO): Promise<IUpdateProjectResponseDTO>
}