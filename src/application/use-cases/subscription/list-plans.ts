import { PlanDuration } from "../../../domain/enums/plan.js";
import type {
  IListSubscriptionPlansRequestDTO,
  IListSubscriptionPlansResponseDTO,
} from "../../dtos/subscription.js";
import type { IPlanRepository } from "../../interfaces/repository/plan.repository.js";
import type { IListSubscriptionPlansUseCase } from "../../interfaces/usecase/subscription/list-plans.js";
import type { IPlanMapper } from "../../mappers/admin/plan.js";

export class ListSubscriptionPlansUseCase
  implements IListSubscriptionPlansUseCase
{
  constructor(
    private _planRepository: IPlanRepository,
    private _planMapper: IPlanMapper
  ) {}

  async execute(
    dto: IListSubscriptionPlansRequestDTO
  ): Promise<IListSubscriptionPlansResponseDTO> {
    const duration = dto.duration ?? PlanDuration.MONTHLY;

    const planDocs = await this._planRepository.findAll({
      filter: { duration, isActive: true, isDeleted: false },
    });

    const data = planDocs.map((doc) => this._planMapper.toResponseDTO(doc));

    return { data };
  }
}
