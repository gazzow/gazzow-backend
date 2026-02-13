import type {
  IMarkNotificationAsReadRequestDTO,
  IMarkNotificationAsReadResponseDTO,
} from "../../../dtos/notification.js";

export interface IMarkNotificationAsReadUseCase {
  execute(
    dto: IMarkNotificationAsReadRequestDTO,
  ): Promise<IMarkNotificationAsReadResponseDTO>;
}
