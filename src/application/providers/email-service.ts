export interface IEmailService {
  sendOtpNotification(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void>;
  sendAccountExistsNotification(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void>;
}
