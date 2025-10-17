import type { IApplicationRequestDTO, IApplicationResponseDTO } from "../../../dtos/application.js";

export interface IApplyProjectUseCase{
    execute(dto: IApplicationRequestDTO): Promise<IApplicationResponseDTO>
}