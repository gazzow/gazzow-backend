import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import type { IRealtimeGateway } from "../../../infrastructure/config/socket/socket-gateway.js";
import { AppError } from "../../../utils/app-error.js";
import type {
  IMarkNotificationAsReadRequestDTO,
  IMarkNotificationAsReadResponseDTO,
} from "../../dtos/notification.js";
import type { INotificationRepository } from "../../interfaces/repository/notification.repository.js";
import type { IMarkNotificationAsReadUseCase } from "../../interfaces/usecase/notification/mark-notification-as-read.js";
import type { INotificationMapper } from "../../mappers/notification.js";

export class MarkNotificationAsReadUseCase
  implements IMarkNotificationAsReadUseCase
{
  constructor(
    private _notificationRepository: INotificationRepository,
    private _notificationMapper: INotificationMapper,
    private _realtimeGateway: IRealtimeGateway,
  ) {}
  async execute(
    dto: IMarkNotificationAsReadRequestDTO,
  ): Promise<IMarkNotificationAsReadResponseDTO> {
    const notificationDoc = await this._notificationRepository.update(
      dto.notificationId,
      { isRead: true },
    );

    if (!notificationDoc) {
      throw new AppError(
        ResponseMessages.NotificationNotFound,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const data =
      this._notificationMapper.toResponseNotificationDTO(notificationDoc);

    const count = await this._notificationRepository.getUnreadCountByUserId(
      data.userId,
    );
    this._realtimeGateway.updateNotificationCount(data.userId, count);

    return { data };
  }
}
