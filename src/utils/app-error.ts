import { ErrorCode } from "../domain/enums/constants/error-code.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: ErrorCode;

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true,
    code = ErrorCode.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this);
  }
}
