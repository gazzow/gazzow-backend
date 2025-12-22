import type {
  IGetPlanRequestDTO,
  IGetPlanResponseDTO,
} from "../../../../dtos/admin/plan.js";

export interface IGetPlanUseCase {
  execute(dto: IGetPlanRequestDTO): Promise<IGetPlanResponseDTO>;
}
