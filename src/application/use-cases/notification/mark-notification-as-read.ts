import type { INotification } from "../../../domain/entities/notification.js";
import { AppError } from "../../../utils/app-error.js";
import type { INotificationRepository } from "../../interfaces/repository/notification.repository.js";
import type { INotificationMapper } from "../../mappers/notification.js";

export interface IMarkNotificationAsReadUseCase {
  execute(
    dto: IMarkNotificationAsReadRequestDTO
  ): Promise<IMarkNotificationAsReadResponseDTO>;
}

export interface IMarkNotificationAsReadRequestDTO {
  notificationId: string;
}

export interface IMarkNotificationAsReadResponseDTO {
  data: INotification;
}

export class MarkNotificationAsReadUseCase
  implements IMarkNotificationAsReadUseCase
{
  constructor(
    private _notificationRepository: INotificationRepository,
    private _notificationMapper: INotificationMapper
  ) {}
  async execute(
    dto: IMarkNotificationAsReadRequestDTO
  ): Promise<IMarkNotificationAsReadResponseDTO> {
    const notificationDoc = await this._notificationRepository.update(
      dto.notificationId,
      { isRead: true }
    );

    if (!notificationDoc) {
      throw new AppError("Notification Not found");
    }

    const data =
      this._notificationMapper.toResponseNotificationDTO(notificationDoc);

    return { data };
  }
}
