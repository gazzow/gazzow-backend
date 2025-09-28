import { env } from "../config/env.js";
import nodemailer from "nodemailer";
import type { IEmailService } from "../../application/providers/email-service.js";

export class EmailService implements IEmailService {
  private _transporter: nodemailer.Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: false,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }

  async sendAccountExistsNotification(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    await this._transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      text,
      html,
    });
  }

  async sendOtpNotification(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    await this._transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      text,
      html,
    });
  }
}
