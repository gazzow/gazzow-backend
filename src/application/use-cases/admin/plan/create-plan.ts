import { ResponseMessages } from "../../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../../domain/enums/constants/status-codes.js";
import { PlanType } from "../../../../domain/enums/plan.js";
import { AppError } from "../../../../utils/app-error.js";
import logger from "../../../../utils/logger.js";
import type {
  ICreatePlanRequestDTO,
  ICreatePlanResponseDTO,
} from "../../../dtos/admin/plan.js";
import type { IPlanRepository } from "../../../interfaces/repository/plan.repository.js";
import type { ICreatePlanUseCase } from "../../../interfaces/usecase/admin/plan/create-plan.js";
import type { IPlanMapper } from "../../../mappers/admin/plan.js";

export class CreatePlanUseCase implements ICreatePlanUseCase {
    constructor(
        private _planRepository: IPlanRepository,
        private _planMapper: IPlanMapper
    ) {}
  async execute(dto: ICreatePlanRequestDTO): Promise<ICreatePlanResponseDTO> {
    logger.debug(`create plan dto: ${JSON.stringify(dto)}`);
    logger.info(dto.type === PlanType.BASE  )
    const planExists = await this._planRepository.findByPlanTypeAndDuration(
      dto.type,
      dto.duration
    );
    if (planExists) {
      throw new AppError(
        ResponseMessages.PlanAlreadyExists,
        HttpStatusCode.CONFLICT
      );
    }

    const persistentModel = this._planMapper.toPersistentModel(dto);

    const planDoc = await this._planRepository.create(persistentModel);

    const data = this._planMapper.toResponseDTO(planDoc);
    return { data };
  }
}
