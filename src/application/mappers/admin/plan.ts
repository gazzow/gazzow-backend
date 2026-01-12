import type { IPlan } from "../../../domain/entities/plan.js";
import type { IPlanDocument } from "../../../infrastructure/db/models/plans.model.js";
import type { ICreatePlanRequestDTO } from "../../dtos/admin/plan.js";

export interface IPlanMapper {
  toPersistentModel(dto: ICreatePlanRequestDTO): Partial<IPlanDocument>;
  toDomain(doc: IPlanDocument): IPlan;
  toResponseDTO(doc: IPlanDocument): IPlan;
}

export class PlanMapper implements IPlanMapper {
  toPersistentModel(dto: ICreatePlanRequestDTO): Partial<IPlanDocument> {
    return {
      name: dto.name,
      type: dto.type,
      price: dto.price,
      duration: dto.duration,
      features: {
        commissionRate: dto.features.commissionRate,
      },
    };
  }

  toDomain(doc: IPlanDocument): IPlan {
    return {
      id: doc._id.toString(),
      name: doc.name,
      type: doc.type,
      price: doc.price,
      duration: doc.duration,
      features: doc.features,
      isActive: doc.isActive,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
  toResponseDTO(doc: IPlanDocument): IPlan {
    return {
      id: doc._id.toString(),
      name: doc.name,
      type: doc.type,
      price: doc.price,
      duration: doc.duration,
      features: doc.features,
      isActive: doc.isActive,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
