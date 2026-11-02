import type { ZodError } from 'zod';

export function fieldErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}