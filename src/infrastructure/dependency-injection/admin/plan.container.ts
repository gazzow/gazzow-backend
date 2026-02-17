import type { IPlanRepository } from "../../../application/interfaces/repository/plan.repository.js";
import type { ICreatePlanUseCase } from "../../../application/interfaces/usecase/admin/plan/create-plan.js";
import type { IGetPlanUseCase } from "../../../application/interfaces/usecase/admin/plan/get-plan.js";
import type { IListPlanUseCase } from "../../../application/interfaces/usecase/admin/plan/list-plan.js";
import type { IUpdatePlanUseCase } from "../../../application/interfaces/usecase/admin/plan/update-plan.js";
import type { IUpdatePlanStatusUseCase } from "../../../application/interfaces/usecase/admin/plan/update-status.js";
import {
  PlanMapper,
  type IPlanMapper,
} from "../../../application/mappers/admin/plan.js";
import { CreatePlanUseCase } from "../../../application/use-cases/admin/plan/create-plan.js";
import { GetPlanUseCase } from "../../../application/use-cases/admin/plan/get-plan.js";
import { ListPlanUseCase } from "../../../application/use-cases/admin/plan/list-plan.js";
import { UpdatePlanUseCase } from "../../../application/use-cases/admin/plan/update-plan.js";
import { UpdatePlanStatusUseCase } from "../../../application/use-cases/admin/plan/update-status.js";
import { PlanController } from "../../../presentation/controllers/admin/plan.controller.js";
import { PlanModel } from "../../db/models/plans.model.js";
import { PlanRepository } from "../../repositories/plan.repository.js";

export class PlanDependencyContainer {
  private readonly _planRepository: IPlanRepository;
  private readonly _planMapper: IPlanMapper;

  constructor() {
    this._planRepository = new PlanRepository(PlanModel);
    this._planMapper = new PlanMapper();
  }

  createPlanUseCase(): ICreatePlanUseCase {
    return new CreatePlanUseCase(this._planRepository, this._planMapper);
  }

  createListPlanUseCase(): IListPlanUseCase {
    return new ListPlanUseCase(this._planRepository, this._planMapper);
  }

  createGetPlanUseCase(): IGetPlanUseCase {
    return new GetPlanUseCase(this._planRepository, this._planMapper);
  }

  createUpdatePlanUseCase(): IUpdatePlanUseCase {
    return new UpdatePlanUseCase(this._planRepository, this._planMapper);
  }

  createUpdatePlanStatusUseCase(): IUpdatePlanStatusUseCase {
    return new UpdatePlanStatusUseCase(this._planRepository, this._planMapper);
  }

  // Plan Controller
  createPlanController(): PlanController {
    return new PlanController(
      this.createPlanUseCase(),
      this.createListPlanUseCase(),
      this.createGetPlanUseCase(),
      this.createUpdatePlanUseCase(),
      this.createUpdatePlanStatusUseCase(),
    );
  }
}
