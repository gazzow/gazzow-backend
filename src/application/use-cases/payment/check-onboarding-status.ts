import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type { ICheckOnboardingStatusRequestDTO } from "../../dtos/payment.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { ICheckOnboardingStatusUseCase } from "../../interfaces/usecase/payment/check-onboarding-status.js";
import type { IUserMapper } from "../../mappers/user/user.js";
import type { IStripeService } from "../../providers/stripe-service.js";


export class CheckOnboardingStatusUseCase
  implements ICheckOnboardingStatusUseCase
{
  constructor(
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper,
    private _stripeService: IStripeService
  ) {}

  async execute(dto: ICheckOnboardingStatusRequestDTO) {
    const userDoc = await this._userRepository.findById(dto.userId);
    if (!userDoc)
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );

    const user = this._userMapper.toPublicDTO(userDoc);
    if (!user.stripeAccountId) {
      throw new AppError(
        ResponseMessages.StripeAccountIdNotFound,
        HttpStatusCode.OK
      );
    }

    // Check account onboarding status
    const isOnboarded = await this._stripeService.checkOnboardingStatus(
      user.stripeAccountId
    );

    return isOnboarded;
  }
}
