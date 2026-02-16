import type { IListPlanResponseDTO } from "../../../dtos/admin/plan.js";
import type { IPlanRepository } from "../../../interfaces/repository/plan.repository.js";
import type { IListPlanUseCase } from "../../../interfaces/usecase/admin/plan/list-plan.js";
import type { IPlanMapper } from "../../../mappers/admin/plan.js";

export class ListPlanUseCase implements IListPlanUseCase {
  constructor(
    private _planRepository: IPlanRepository,
    private _planMapper: IPlanMapper,
  ) {}
  async execute(): Promise<IListPlanResponseDTO> {
    const planDocs = await this._planRepository.findAll({
      filter: { isDeleted: false },
    });

    const data = planDocs.map((doc) => this._planMapper.toResponseDTO(doc));

    return { data };
  }
}
