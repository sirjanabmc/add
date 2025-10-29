import { useCallback } from 'react';
import { isRetryableError } from '../types/errors';

interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export function useRetry(config: RetryConfig = {}) {
  // 👇 Move defaultConfig inside the function (avoids ReferenceError)
  const defaultConfig: Required<RetryConfig> = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
  };

  const { maxRetries, baseDelay, maxDelay } = { ...defaultConfig, ...config };

  const retryOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      let lastError: unknown;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error;
          if (!isRetryableError(error) || attempt === maxRetries) {
            throw error instanceof Error ? error : new Error(String(error));
          }

          const delay = Math.min(Math.ceil(baseDelay * Math.pow(2, attempt)), maxDelay);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw lastError;
    },
    [maxRetries, baseDelay, maxDelay]
  );

  return retryOperation;
}
