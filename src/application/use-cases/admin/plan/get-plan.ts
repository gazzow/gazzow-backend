import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../../utils/app-error.js";
import type {
  IGetPlanRequestDTO,
  IGetPlanResponseDTO,
} from "../../../dtos/admin/plan.js";
import type { IPlanRepository } from "../../../interfaces/repository/plan.repository.js";
import type { IGetPlanUseCase } from "../../../interfaces/usecase/admin/plan/get-plan.js";
import type { IPlanMapper } from "../../../mappers/admin/plan.js";

export class GetPlanUseCase implements IGetPlanUseCase {
  constructor(
    private _planRepository: IPlanRepository,
    private _planMapper: IPlanMapper
  ) {}

  async execute(dto: IGetPlanRequestDTO): Promise<IGetPlanResponseDTO> {
    const planDoc = await this._planRepository.findById(dto.planId);
    if (!planDoc)
      throw new AppError(
        ResponseMessages.PlanNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const data = this._planMapper.toResponseDTO(planDoc);

    return { data };
  }
}
