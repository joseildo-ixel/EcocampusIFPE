export function isUniqueConstraintViolation(error: unknown): boolean {
  return hasPostgresErrorCode(error, '23505');
}

export function isForeignKeyViolation(error: unknown): boolean {
  return (
    hasPostgresErrorCode(error, '23503') ||
    hasPostgresErrorCode(error, '23001')
  );
}

function hasPostgresErrorCode(error: unknown, code: string): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  if ('driverError' in error) {
    return hasPostgresErrorCode(error.driverError, code);
  }
  return 'code' in error && error.code === code;
}
