import { ResponseMessages } from "../../../domain/enums/constants/response-messages.js";
import { HttpStatusCode } from "../../../domain/enums/constants/status-codes.js";
import { AppError } from "../../../utils/app-error.js";
import type { ICreateConnectedAccountRequestDTO } from "../../dtos/payment.js";
import type { IUserRepository } from "../../interfaces/repository/user-repository.js";
import type { ICreateConnectedAccountUseCase } from "../../interfaces/usecase/payment/create-connected-account.js";
import type { IUserMapper } from "../../mappers/user/user.js";
import type { IStripeService } from "../../providers/stripe-service.js";

export class CreateConnectedAccountUseCase
  implements ICreateConnectedAccountUseCase
{
  constructor(
    private _stripeService: IStripeService,
    private _userRepository: IUserRepository,
    private _userMapper: IUserMapper
  ) {}

  async execute(dto: ICreateConnectedAccountRequestDTO) {
    const userDoc = await this._userRepository.findById(dto.userId);
    if (!userDoc)
      throw new AppError(
        ResponseMessages.UserNotFound,
        HttpStatusCode.NOT_FOUND
      );
    const user = this._userMapper.toPublicDTO(userDoc);
    const accountId = await this._stripeService.createAccount(user.email);

    await this._userRepository.update(dto.userId, {
      stripeAccountId: accountId,
    });
  }
}
