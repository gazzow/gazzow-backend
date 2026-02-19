import type { ErrorCode } from "../../domain/enums/constants/error-code.js";

export type ErrorDetail = {
  field?: string;
  message: string;
};

export type PaginationMeta = {
  skip: number;
  limit: number;
  total: number;
};

export class ApiResponse<T = unknown, M = unknown, E = ErrorDetail | string> {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: E[] | null;
  code?: ErrorCode | null;
  meta?: M | null;
  timestamp: string;

  private constructor(
    success: boolean,
    message: string,
    data: T | null = null,
    errors: E[] | null = null,
    code: ErrorCode | null = null,
    meta: M | null = null,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.code = code;
    this.errors = errors;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  /** ✅ Success Response */
  static success<T, M = null>(
    message: string,
    data: T | null = null,
    meta: M | null = null,
  ): ApiResponse<T, M, never> {
    return new ApiResponse<T, M, never>(true, message, data, null, null, meta);
  }

  /** ❌ Error Response */
  static error<E extends ErrorDetail | string, M = null>(
    message: string,
    errors: E[] | null = null,
    code: ErrorCode | null = null,
    meta: M | null = null,
  ): ApiResponse<null, M, E> {
    return new ApiResponse<null, M, E>(
      false,
      message,
      null,
      errors,
      code,
      meta,
    );
  }

  /** ⚠️ Validation Error Response */
  static validationError(
    errors: ErrorDetail[],
  ): ApiResponse<null, null, ErrorDetail> {
    return new ApiResponse<null, null, ErrorDetail>(
      false,
      // "Please correct the highlighted errors.",
      "Oops! Something needs your attention.",
      null,
      errors,
    );
  }

  /** 📄 Paginated Success Response */
  static paginated<T>(
    message: string,
    data: T[],
    meta: PaginationMeta,
  ): ApiResponse<T[], PaginationMeta, never> {
    return new ApiResponse<T[], PaginationMeta, never>(
      true,
      message,
      data,
      null,
      null,
      meta,
    );
  }
}
