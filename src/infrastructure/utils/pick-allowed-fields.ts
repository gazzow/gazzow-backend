export function pickAllowedFields<T>(
  source: Partial<T>,
  allowed: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of allowed) {
    if (source[key] !== undefined && source[key] !== null) {
      result[key] = source[key];
    }
  }
  return result;
}
