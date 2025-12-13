export interface IHandleStripeWebhookUseCase {
  execute(payload: Buffer, signature: string): Promise<void>;
}
