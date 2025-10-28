import { useCallback } from 'react';
import { ServiceOperationError, isRetryableError } from '../types/errors';

interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

const defaultConfig: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

export function useRetry(config: RetryConfig = {}) {
  const { maxRetries, baseDelay, maxDelay } = { ...defaultConfig, ...config };

  const retryOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      let lastError: Error | undefined;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          if (!isRetryableError(error) || attempt === maxRetries) {
            throw lastError;
          }

          const delay = Math.min(
            Math.ceil(baseDelay * Math.pow(2, attempt)),
            maxDelay
          );

          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw lastError;
    },
    [maxRetries, baseDelay, maxDelay]
  );

  return retryOperation;
}