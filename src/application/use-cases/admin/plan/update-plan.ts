import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import type {
  IUpdatePlanRequestDTO,
  IUpdatePlanResponseDTO,
} from "../../../dtos/admin/plan.js";
import type { IPlanRepository } from "../../../interfaces/repository/plan.repository.js";
import type { IUpdatePlanUseCase } from "../../../interfaces/usecase/admin/plan/update-plan.js";
import type { IPlanMapper } from "../../../mappers/admin/plan.js";

export class UpdatePlanUseCase implements IUpdatePlanUseCase {
  constructor(
    private _planRepository: IPlanRepository,
    private _planMapper: IPlanMapper,
  ) {}
  async execute(dto: IUpdatePlanRequestDTO): Promise<IUpdatePlanResponseDTO> {
    const updateModel = this._planMapper.toUpdatePlanEntity(dto.data);

    // 🔹 Only validate if type or duration is being updated
    if (updateModel.type || updateModel.duration) {
      const existingPlan = await this._planRepository.findByPlanTypeAndDuration(
        updateModel.type,
        updateModel.duration,
      );

      // 🔹 Ensure it's not the same plan
      if (
        existingPlan &&
        existingPlan.id !== dto.planId
      ) {
        throw new AppError(
          ResponseMessages.PlanAlreadyExists,
          HttpStatusCode.CONFLICT,
        );
      }
    }

    const updatedPlan = await this._planRepository.update(
      dto.planId,
      updateModel,
    );

    if (!updatedPlan) {
      throw new AppError(
        ResponseMessages.PlanUpdateFailed,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const data = this._planMapper.toResponseDTO(updatedPlan);

    return { data };
  }
}
