import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import logger from "../../../utils/logger.js";
import type {
  IGenerateOnboardingLinkRequestDTO,
  IGenerateOnboardingLinkResponseDTO,
} from "../../dtos/payment.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { IGenerateOnboardingLinkUseCase } from "../../interfaces/usecase/payment/generate-onboarding-link.js";
import type { IUserMapper } from "../../mappers/user/user.js";
import type { IStripeService } from "../../providers/stripe-service.js";

export class GenerateOnboardingLinkUseCase
  implements IGenerateOnboardingLinkUseCase
{
  constructor(
    private _stripeService: IStripeService,
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper
  ) {}

  async execute(
    dto: IGenerateOnboardingLinkRequestDTO
  ): Promise<IGenerateOnboardingLinkResponseDTO> {
    const userDoc = await this._userRepository.findById(dto.userId);
    if (!userDoc)
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const user = this._userMapper.toPublicDTO(userDoc);
    logger.debug(
      `Generating onboarding link for user acc id: ${user.stripeAccountId}`
    );
    if (!user.stripeAccountId) {
      throw new AppError(
        ResponseMessages.StripeAccountIdNotFound,
        HttpStatusCode.NOT_FOUND
      );
    }

    const { url } = await this._stripeService.generateOnboardingLink(
      user.stripeAccountId
    );

    return { onboardingUrl: url };
  }
}
