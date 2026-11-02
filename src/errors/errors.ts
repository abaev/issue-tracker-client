import { hasOwn } from '@/utils/object.ts';

export interface BaseErrorOptions extends ErrorOptions {
  details?: unknown;
}

export class BaseError extends Error {
  declare details?: unknown;

  constructor(message: string, options: BaseErrorOptions) {
    super(message, options);
    this.name = 'BaseError';

    if(hasOwn<string>(options, 'details')) this.details = options.details;
  }
}

export class ApiError extends BaseError {
  constructor(message: string, options: BaseErrorOptions) {
    super(message, options);
    this.name = 'ApiError';
  }
}
