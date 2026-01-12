import type { IListPlanResponseDTO } from "../../../../dtos/admin/plan.js";

export interface IListPlanUseCase {
  execute(): Promise<IListPlanResponseDTO>;
}
