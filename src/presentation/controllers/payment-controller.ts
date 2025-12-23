import type { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../domain/enums/constants/status-codes.js";
import logger from "../../utils/logger.js";
import { ApiResponse } from "../common/api-response.js";
import type { ITaskCheckoutSessionUseCase } from "../../application/interfaces/usecase/payment/task-checkout.js";
import type { ICreateConnectedAccountUseCase } from "../../application/interfaces/usecase/payment/create-connected-account.js";
import type { IGenerateOnboardingLinkUseCase } from "../../application/interfaces/usecase/payment/generate-onboarding-link.js";
import type { ICheckOnboardingStatusUseCase } from "../../application/interfaces/usecase/payment/check-onboarding-status.js";
import { ResponseMessages } from "../../domain/enums/constants/response-messages.js";
import type { ISubscriptionCheckoutUseCase } from "../../application/interfaces/usecase/payment/subscription-checkout.js";

export class PaymentController {
  constructor(
    private _checkoutSessionUseCase: ITaskCheckoutSessionUseCase,
    private _createConnectedAccount: ICreateConnectedAccountUseCase,
    private _generateOnboardingLink: IGenerateOnboardingLinkUseCase,
    private _checkOnboardingStatus: ICheckOnboardingStatusUseCase,
    private _subscriptionCheckoutUseCase: ISubscriptionCheckoutUseCase
  ) {}

  connectAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug("Connect Account API hit 🚀");

    try {
      const userId = req.user!.id;
      await this._createConnectedAccount.execute({ userId });
      res
        .status(HttpStatusCode.CREATED)
        .json(ApiResponse.success(ResponseMessages.StripeAccountCreated));
    } catch (error) {
      next(error);
    }
  };

  onboardingLink = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug(" Generate Onboarding Link API hit 🚀");

    try {
      const userId = req.user!.id;
      const { onboardingUrl } = await this._generateOnboardingLink.execute({
        userId,
      });
      res.status(HttpStatusCode.OK).json(
        ApiResponse.success(ResponseMessages.OnboardingUrlGenerated, {
          onboardingUrl,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  checkOnboardingStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(" Check Onboarding Status API hit 🚀");
    const userId = req.user!.id;
    const dto = {
      userId,
    };
    try {
      const isOnboarded = await this._checkOnboardingStatus.execute(dto);
      res.status(HttpStatusCode.OK).json(
        ApiResponse.success(ResponseMessages.OnboardingStatusFetched, {
          isOnboarded,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  taskCheckoutSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug("Task Checkout session API hit 🚀");
    const { taskId } = req.body;
    const successUrl = `${process.env.BASE_URL}/projects/payment-success`;
    const cancelUrl = `${process.env.BASE_URL}/projects/payment-failed`;

    const dto = {
      taskId,
      successUrl,
      cancelUrl,
    };

    try {
      const { checkoutUrl } = await this._checkoutSessionUseCase.execute(dto);
      res.status(HttpStatusCode.CREATED).json(
        ApiResponse.success(ResponseMessages.CheckoutSessionCreated, {
          checkoutUrl,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  subscriptionCheckout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug("Subscription Checkout session API hit 🚀");
    const { planId } = req.body;
    const userId = req.user!.id;

    const successUrl = `${process.env.BASE_URL}/pricing/payment-success`;
    const cancelUrl = `${process.env.BASE_URL}/pricing/payment-failed`;

    const dto = {
      userId,
      planId,
      successUrl,
      cancelUrl,
    };

    try {
      const { checkoutUrl } =
        await this._subscriptionCheckoutUseCase.execute(dto);
      res.status(HttpStatusCode.CREATED).json(
        ApiResponse.success(ResponseMessages.CheckoutSessionCreated, {
          checkoutUrl,
        })
      );
    } catch (error) {
      next(error);
    }
  };
}
