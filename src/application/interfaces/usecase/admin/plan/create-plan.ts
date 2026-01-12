import type { ICreatePlanRequestDTO, ICreatePlanResponseDTO } from "../../../../dtos/admin/plan.js";

export interface ICreatePlanUseCase {
  execute(dto: ICreatePlanRequestDTO): Promise<ICreatePlanResponseDTO>;
}
