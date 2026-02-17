import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { AppError } from "../../../../utils/app-error.js";
import type {
  IUpdatePlanStatusRequestDTO,
  IUpdatePlanStatusResponseDTO,
} from "../../../dtos/admin/plan.js";
import type { IPlanRepository } from "../../../interfaces/repository/plan.repository.js";
import type { IUpdatePlanStatusUseCase } from "../../../interfaces/usecase/admin/plan/update-status.js";
import type { IPlanMapper } from "../../../mappers/admin/plan.js";

export class UpdatePlanStatusUseCase implements IUpdatePlanStatusUseCase {
  constructor(
    private _planRepository: IPlanRepository,
    private _planMapper: IPlanMapper,
  ) {}

  async execute(
    dto: IUpdatePlanStatusRequestDTO,
  ): Promise<IUpdatePlanStatusResponseDTO> {
    const updatedPlan = await this._planRepository.update(dto.planId, {
      isActive: dto.isActive,
    });

    if (!updatedPlan) {
      throw new AppError(ResponseMessages.PlanUpdateFailed);
    }

    const data = this._planMapper.toResponseDTO(updatedPlan);

    return { data };
  }
}
