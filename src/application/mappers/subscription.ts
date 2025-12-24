import { Types } from "mongoose";
import type { ISubscription } from "../../domain/entities/subscription.js";
import type { ISubscriptionDocument } from "../../infrastructure/db/models/subscription.js";
import type { ICreateSubscriptionDTO } from "../dtos/subscription.js";

export interface ISubscriptionMapper {
  toPersistentModel(
    dto: ICreateSubscriptionDTO
  ): Partial<ISubscriptionDocument>;
  toResponseDTO(doc: ISubscriptionDocument): ISubscription;
}

export class SubscriptionMapper implements ISubscriptionMapper {
  toPersistentModel(
    dto: ICreateSubscriptionDTO
  ): Partial<ISubscriptionDocument> {
    return {
      userId: new Types.ObjectId(dto.userId),
      planId: new Types.ObjectId(dto.planId),
      activePlan: {
        name: dto.activePlan.name,
        type: dto.activePlan.type,
        duration: dto.activePlan.duration,
        price: dto.activePlan.price,
        features: dto.activePlan.features,
      },
      status: dto.status,
      startDate: dto.startDate,
      endDate: dto.endDate,
    };
  }

  toResponseDTO(doc: ISubscriptionDocument): ISubscription {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      planId: doc.planId.toString(),
      activePlan: {
        name: doc.activePlan.name,
        type: doc.activePlan.type,
        duration: doc.activePlan.duration,
        price: doc.activePlan.price,
        features: doc.activePlan.features,
      },
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
      autoRenew: doc.autoRenew,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
