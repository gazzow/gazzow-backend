import type {
  IUpdatePlanStatusRequestDTO,
  IUpdatePlanStatusResponseDTO,
} from "../../../../dtos/admin/plan.js";

export interface IUpdatePlanStatusUseCase {
  execute(
    dto: IUpdatePlanStatusRequestDTO,
  ): Promise<IUpdatePlanStatusResponseDTO>;
}
