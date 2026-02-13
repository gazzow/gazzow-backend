import type { INotificationRepository } from "../../application/interfaces/repository/notification.repository.js";
import type { IGetUnreadNotificationCountUseCase } from "../../application/interfaces/usecase/notification/get-count.js";
import type { IMarkAllNotificationsAsReadUseCase } from "../../application/interfaces/usecase/notification/mark-all-notifications-as -read.js";
import type { IMarkNotificationAsReadUseCase } from "../../application/interfaces/usecase/notification/mark-notification-as-read.js";
import {
  NotificationMapper,
  type INotificationMapper,
} from "../../application/mappers/notification.js";
import type { INotificationService } from "../../application/providers/notification.service.js";
import {
  CreateNotificationUseCase,
  type ICreateNotificationUseCase,
} from "../../application/use-cases/notification/create-notification.js";
import { GetUnreadNotificationCountUseCase } from "../../application/use-cases/notification/get-count.js";

import {
  ListNotificationUseCase,
  type IListNotificationUseCase,
} from "../../application/use-cases/notification/list-notifications.js";
import { MarkAllNotificationsAsReadUseCase } from "../../application/use-cases/notification/mark-all-notifications-as-read.js";
import { MarkNotificationAsReadUseCase } from "../../application/use-cases/notification/mark-notification-as-read.js";

import { NotificationController } from "../../presentation/controllers/notification.controller.js";
import type { IRealtimeGateway } from "../config/socket/socket-gateway.js";

import { NotificationModel } from "../db/models/notification.model.js";
import { NotificationService } from "../providers/notification.service.js";
import { NotificationRepository } from "../repositories/notification.repository.js";

export class NotificationDependencyContainer {
  private readonly _notificationRepository: INotificationRepository;
  private readonly _notificationMapper: INotificationMapper;
  private readonly _notificationService: INotificationService;
  private readonly _socketGateway: IRealtimeGateway;

  constructor(socketGateway: IRealtimeGateway) {
    this._notificationRepository = new NotificationRepository(
      NotificationModel,
    );
    this._notificationMapper = new NotificationMapper();
    this._notificationService = new NotificationService(
      this._notificationRepository,
      this._notificationMapper,
    );
    this._socketGateway = socketGateway;
  }

  createListNotificationsUseCase(): IListNotificationUseCase {
    return new ListNotificationUseCase(
      this._notificationRepository,
      this._notificationMapper,
    );
  }

  createMarkAsReadUseCase(): IMarkNotificationAsReadUseCase {
    return new MarkNotificationAsReadUseCase(
      this._notificationRepository,
      this._notificationMapper,
      this._socketGateway,
    );
  }

  createMarkAllAsReadUseCase(): IMarkAllNotificationsAsReadUseCase {
    return new MarkAllNotificationsAsReadUseCase(this._notificationRepository);
  }

  public createNotificationUseCase(): ICreateNotificationUseCase {
    return new CreateNotificationUseCase(this._notificationService);
  }

  private createGetUnreadNotificationCountUseCase(): IGetUnreadNotificationCountUseCase {
    return new GetUnreadNotificationCountUseCase(this._notificationRepository);
  }
  // Subscription Controller
  createNotificationController(): NotificationController {
    return new NotificationController(
      this.createListNotificationsUseCase(),
      this.createMarkAsReadUseCase(),
      this.createGetUnreadNotificationCountUseCase(),
      this.createMarkAllAsReadUseCase(),
    );
  }
}
