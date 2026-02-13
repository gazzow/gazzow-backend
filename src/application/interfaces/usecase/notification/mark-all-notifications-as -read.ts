import type { IMarkAllNotificationAsReadRequestDTO } from "../../../dtos/notification.js";

export interface IMarkAllNotificationsAsReadUseCase {
  execute(dto: IMarkAllNotificationAsReadRequestDTO): Promise<void>;
}
