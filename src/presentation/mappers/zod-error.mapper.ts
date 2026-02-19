import type { ZodError } from "zod/v3";

export type ErrorDetail = {
  field?: string;
  message: string;
};

export const mapZodErrorToErrorDetail = (error: ZodError): ErrorDetail[] => {
  const fieldErrorMap = new Map<string, string>();

  for (const err of error.errors) {
    const fieldPath = err.path.length ? err.path.join(".") : "_form";

    if (!fieldErrorMap.has(fieldPath)) {
      fieldErrorMap.set(fieldPath, err.message);
    }
  }

  return Array.from(fieldErrorMap.entries()).map(([field, message]) =>
    field === "_form" ? { message } : { field, message },
  );
};
