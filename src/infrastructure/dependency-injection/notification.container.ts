import {
  NotificationMapper,
  type INotificationMapper,
} from "../../application/mappers/notification.js";
import {
  CreateNotificationUseCase,
  type ICreateNotificationUseCase,
} from "../../application/use-cases/notification/create-notification.js";
import {
  ListNotificationUseCase,
  type IListNotificationUseCase,
} from "../../application/use-cases/notification/list-notifications.js";
import {
  MarkNotificationAsReadUseCase,
  type IMarkNotificationAsReadUseCase,
} from "../../application/use-cases/notification/mark-notification-as-read.js";
import {
  RegisterTokenUseCase,
  type IRegisterTokenUseCase,
} from "../../application/use-cases/notification/register-token.js";
import { NotificationController } from "../../presentation/controllers/notification.controller.js";
import { NotificationModel } from "../db/models/notification.model.js";
import { TokenModel } from "../db/models/token-model.js";
import {
  NotificationService,
  type INotificationService,
} from "../providers/notification.service.js";
import { PushService, type IPushService } from "../providers/push.service.js";
import {
  NotificationRepository,
  type INotificationRepository,
} from "../repositories/notification.repository.js";
import {
  TokenRepository,
  type ITokenRepository,
} from "../repositories/token-repository.js";

export class NotificationDependencyContainer {
  private readonly _tokenRepository: ITokenRepository;
  private readonly _notificationRepository: INotificationRepository;
  private readonly _notificationMapper: INotificationMapper;
  private readonly _notificationService: INotificationService;
  private readonly _pushService: IPushService;

  constructor() {
    this._tokenRepository = new TokenRepository(TokenModel);
    this._notificationRepository = new NotificationRepository(
      NotificationModel
    );
    this._notificationMapper = new NotificationMapper();
    this._pushService = new PushService(
      this._tokenRepository,
      this._notificationMapper
    );
    this._notificationService = new NotificationService(
      this._notificationRepository,
      this._notificationMapper,
      this._pushService
    );
  }

  createRegisterTokenUseCase(): IRegisterTokenUseCase {
    return new RegisterTokenUseCase(
      this._tokenRepository,
      this._notificationMapper
    );
  }

  createListNotificationsUseCase(): IListNotificationUseCase {
    return new ListNotificationUseCase(
      this._notificationRepository,
      this._notificationMapper
    );
  }

  createMarkAsReadUseCase(): IMarkNotificationAsReadUseCase {
    return new MarkNotificationAsReadUseCase(
      this._notificationRepository,
      this._notificationMapper
    );
  }

  // Notification DI
  public createNotificationUseCase(): ICreateNotificationUseCase {
    return new CreateNotificationUseCase(this._notificationService);
  }

  // Subscription Controller
  createNotificationController(): NotificationController {
    return new NotificationController(
      this.createRegisterTokenUseCase(),
      this.createListNotificationsUseCase(),
      this.createMarkAsReadUseCase()
    );
  }
}
