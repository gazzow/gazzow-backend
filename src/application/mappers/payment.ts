import { Types } from "mongoose";
import type { IPaymentDocument } from "../../infrastructure/db/models/payment.model.js";
import type { IPayment } from "../../domain/entities/payment.js";

export interface IPaymentMapper {
  toPersistentModel(doc: Partial<IPayment>): Partial<IPaymentDocument>;
  toResponseDTO(doc: IPaymentDocument): IPayment;
}

export class PaymentMapper implements IPaymentMapper {
  toPersistentModel(doc: Partial<IPayment>): Partial<IPaymentDocument> {
    return {
      userId: new Types.ObjectId(doc.userId),
      ...(doc.taskId && {
        taskId: new Types.ObjectId(doc.taskId),
      }),
      ...(doc.subscriptionId && {
        subscriptionId: new Types.ObjectId(doc.subscriptionId),
      }),
      ...(doc.relatedUserId && {
        relatedUserId: new Types.ObjectId(doc.relatedUserId),
      }),
      ...(doc.stripePaymentIntentId && {
        stripePaymentIntentId: doc.stripePaymentIntentId,
      }),
      ...(doc.stripeTransferId && {
        stripeTransferId: doc.stripeTransferId,
      }),
      ...(doc.totalAmount && {
        totalAmount: doc.totalAmount,
      }),
      ...(doc.platformFee && {
        platformFee: doc.platformFee,
      }),
      ...(doc.netAmount && {
        netAmount: doc.netAmount,
      }),
      currency: doc.currency || "USD",
      type: doc.type!,
      status: doc.status!,
    };
  }

  toResponseDTO(doc: IPaymentDocument): IPayment {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      ...(doc.taskId && {
        taskId: doc.taskId.toString(),
      }),
      ...(doc.subscriptionId && {
        subscriptionId: doc.subscriptionId.toString(),
      }),
      ...(doc.relatedUserId && {
        relatedUserId: doc.relatedUserId.toString(),
      }),
      ...(doc.stripePaymentIntentId && {
        stripePaymentIntentId: doc.stripePaymentIntentId,
      }),
      ...(doc.stripeTransferId && {
        stripeTransferId: doc.stripeTransferId,
      }),
      ...(doc.totalAmount && {
        totalAmount: doc.totalAmount,
      }),
      ...(doc.platformFee && {
        platformFee: doc.platformFee,
      }),
      ...(doc.netAmount && {
        netAmount: doc.netAmount,
      }),
      currency: doc.currency,
      type: doc.type,
      status: doc.status,
      createdAt: doc.createdAt,
    };
  }
}
