import type { IMessage } from "../../../domain/entities/message.js";
import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import type { IRealtimeGateway } from "../../../infrastructure/config/socket/socket-gateway.js";
import { AppError } from "../../../utils/app-error.js";
import type { ISendTeamChatMessageRequestDTO } from "../../dtos/team-chat.js";
import type { IProjectRepository } from "../../interfaces/repository/project-repository.js";
import type { ITeamChatRepository } from "../../interfaces/repository/team-chat.repository.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { ISendTeamChatMessageUseCase } from "../../interfaces/usecase/team-chat/send-message.js";
import type { IProjectMapper } from "../../mappers/project.js";
import type { ITeamChatMapper } from "../../mappers/team-chat.js";
import type { IUserMapper } from "../../mappers/user/user.js";

export class SendProjectMessageUseCase implements ISendTeamChatMessageUseCase {
  constructor(
    private readonly _projectRepository: IProjectRepository,
    private readonly _projectMapper: IProjectMapper,
    private readonly _teamChatRepository: ITeamChatRepository,
    private readonly _teamChatMapper: ITeamChatMapper,
    private readonly _userRepository: IUserRepository,
    private readonly _userMapper: IUserMapper,
    private readonly _realtime: IRealtimeGateway
  ) {}

  async execute(dto: ISendTeamChatMessageRequestDTO): Promise<void> {
    const { projectId, senderId, content } = dto;
    // 1. Load project or validate user using project data from db
    const projectDoc = await this._projectRepository.findById(projectId);
    if (!projectDoc) {
      throw new Error("Project not found");
    }
    const project = this._projectMapper.toDomain(projectDoc);

    // 2. Authorization (creator or contributor)
    const isContributor = project.contributors.some(
      (c) => c.userId === senderId
    );
    const isCreator = project.creatorId === senderId;

    if (!isContributor && !isCreator) {
      throw new Error("User not part of this project");
    }

    // Take user profile snapshot
    const userDoc = await this._userRepository.findById(senderId);
    if (!userDoc) {
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const { name, imageUrl } = this._userMapper.toPublicDTO(userDoc);

    // 3. Create domain message
    const message: Partial<IMessage> = {
      projectId,
      senderId,
      senderName: name,
      senderImageUrl: imageUrl!,
      content,
      isCreator,
    };

    // 4. Persist message
    const persistentModel = this._teamChatMapper.toPersistent(message);

    const createdMessageDoc =
      await this._teamChatRepository.create(persistentModel);

    const savedMessage = this._teamChatMapper.toResponseDTO(createdMessageDoc);

    // 5. Emit realtime update
    this._realtime.emitToProject(projectId, "TEAM_MESSAGE", savedMessage);
  }
}
