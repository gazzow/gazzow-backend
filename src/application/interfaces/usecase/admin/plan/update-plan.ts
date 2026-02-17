import type { IUpdatePlanRequestDTO, IUpdatePlanResponseDTO } from "../../../../dtos/admin/plan.js";

export interface IUpdatePlanUseCase{
    execute(dto: IUpdatePlanRequestDTO): Promise<IUpdatePlanResponseDTO>
}   