import { useState, useCallback } from 'react';
import {
  KokoroTTSRequest,
  KokoroTTSResponse,
  generateSpeech,
  generateSpeechWithQueue,
  getSpeechGenerationStatus,
  getSpeechGenerationResult,
  initializeKokoroTTS,
} from '../services/kokoroTTSService';

interface UseKokoroTTSOptions {
  apiKey: string;
  onError?: (error: Error) => void;
}

interface UseKokoroTTSResult {
  generate: (request: KokoroTTSRequest) => Promise<KokoroTTSResponse>;
  generateWithQueue: (request: KokoroTTSRequest, webhookUrl?: string) => Promise<{ requestId: string }>;
  getStatus: (requestId: string) => Promise<any>;
  getResult: (requestId: string) => Promise<KokoroTTSResponse>;
  isLoading: boolean;
  error: Error | null;
}

export const useKokoroTTS = ({ apiKey, onError }: UseKokoroTTSOptions): UseKokoroTTSResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize the service with API key
  initializeKokoroTTS(apiKey);

  const handleError = useCallback((error: Error) => {
    setError(error);
    onError?.(error);
  }, [onError]);

  const generate = useCallback(async (request: KokoroTTSRequest): Promise<KokoroTTSResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateSpeech(request);
      return result;
    } catch (error) {
      handleError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const generateWithQueue = useCallback(async (
    request: KokoroTTSRequest,
    webhookUrl?: string
  ): Promise<{ requestId: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateSpeechWithQueue(request, webhookUrl);
      return result;
    } catch (error) {
      handleError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getStatus = useCallback(async (requestId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const status = await getSpeechGenerationStatus(requestId);
      return status;
    } catch (error) {
      handleError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getResult = useCallback(async (requestId: string): Promise<KokoroTTSResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSpeechGenerationResult(requestId);
      return result;
    } catch (error) {
      handleError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    generate,
    generateWithQueue,
    getStatus,
    getResult,
    isLoading,
    error,
  };
}; 