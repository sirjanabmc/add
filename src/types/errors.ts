export type ServiceError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ValidationError = {
  field: string;
  message: string;
};

export type NetworkError = {
  code: 'NETWORK_ERROR';
  message: string;
  isRetryable: boolean;
};

export type ApiError = ServiceError | ValidationError | NetworkError;

export class ServiceOperationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ServiceOperationError';
  }
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof ServiceOperationError) {
    return ['NETWORK_ERROR', 'TIMEOUT_ERROR', 'SERVICE_UNAVAILABLE'].includes(error.code);
  }
  return false;
}