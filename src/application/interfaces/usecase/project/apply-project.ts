import type { IApplicationRequestDTO, IApplicationResponseDTO } from "../../../dtos/application.js";

export interface ICreateApplicationUseCase{
    execute(dto: IApplicationRequestDTO): Promise<IApplicationResponseDTO>
}