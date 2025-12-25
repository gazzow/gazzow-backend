import type { INotification } from "../../../domain/entities/notification.js";
import type { INotificationRepository } from "../../../infrastructure/repositories/notification.repository.js";
import type { INotificationMapper } from "../../mappers/notification.js";

export interface IListNotificationUseCase {
  execute(
    dto: IListNotificationRequestDTO
  ): Promise<IListNotificationResponseDTO>;
}

export interface IListNotificationRequestDTO {
  userId: string;
}
export interface IListNotificationResponseDTO {
  data: INotification[];
}

export class ListNotificationUseCase implements IListNotificationUseCase {
  constructor(
    private _notificationRepository: INotificationRepository,
    private _notificationMapper: INotificationMapper
  ) {}
  async execute(
    dto: IListNotificationRequestDTO
  ): Promise<IListNotificationResponseDTO> {
    const notificationDocs = await this._notificationRepository.findAll({
      filter: { userId: dto.userId },
      sort: { createdAt: -1 },
      limit: 0,
    });

    const data = notificationDocs.map((notificationDoc) =>
      this._notificationMapper.toResponseNotificationDTO(notificationDoc)
    );

    return { data };
  }
}
