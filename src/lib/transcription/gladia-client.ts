/**
 * Gladia API Client for German Audio Transcription
 * https://docs.gladia.io/
 */

interface GladiaTranscriptionRequest {
  audioUrl: string;
  language: string;
  languageBehaviour?: 'manual' | 'automatic';
  enableCodeSwitching?: boolean;
  outputFormat?: 'json' | 'txt' | 'srt' | 'vtt';
}

interface GladiaTranscriptionResponse {
  id: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  result?: {
    transcription: {
      full_transcript: string;
      success: boolean;
      confidence?: number;
    };
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
  duration?: number;
}

export class GladiaClient {
  private apiKey: string;
  private baseUrl = 'https://api.gladia.io/v2';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GLADIA_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('GLADIA_API_KEY is required');
    }
  }

  /**
   * Transcribe audio file to German text
   * Uses asynchronous transcription for better quality and longer files
   */
  async transcribe(audioUrl: string): Promise<TranscriptionResult> {
    try {
      // Start transcription job
      const transcriptionId = await this.startTranscription(audioUrl);

      // Poll for results
      const result = await this.pollTranscriptionResult(transcriptionId);

      return result;
    } catch (error) {
      console.error('Gladia transcription error:', error);
      throw error;
    }
  }

  /**
   * Start asynchronous transcription job
   */
  private async startTranscription(audioUrl: string): Promise<string> {
    const request: GladiaTranscriptionRequest = {
      audioUrl,
      language: 'de', // German
      languageBehaviour: 'manual', // Stick to German, don't auto-detect
      enableCodeSwitching: false, // Don't switch languages mid-transcript
      outputFormat: 'json',
    };

    const response = await fetch(`${this.baseUrl}/transcription`, {
      method: 'POST',
      headers: {
        'x-gladia-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Gladia API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  }

  /**
   * Poll transcription result until complete
   * Polls every 2 seconds, max 5 minutes
   */
  private async pollTranscriptionResult(
    transcriptionId: string,
    maxAttempts: number = 150
  ): Promise<TranscriptionResult> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(
        `${this.baseUrl}/transcription/${transcriptionId}`,
        {
          headers: {
            'x-gladia-key': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch transcription result');
      }

      const data: GladiaTranscriptionResponse = await response.json();

      if (data.status === 'done') {
        if (!data.result?.transcription?.success) {
          throw new Error('Transcription failed');
        }

        return {
          text: data.result.transcription.full_transcript,
          confidence: data.result.transcription.confidence || 0.8,
          language: 'de',
        };
      }

      if (data.status === 'error') {
        throw new Error(
          data.error?.message || 'Transcription failed with unknown error'
        );
      }

      // Wait 2 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error('Transcription timeout - took longer than 5 minutes');
  }

  /**
   * Get supported languages
   * For reference - we mainly use 'de' for German
   */
  static getSupportedLanguages(): string[] {
    return [
      'de', // German (Standard)
      'de-CH', // Swiss German
      'de-AT', // Austrian German
    ];
  }
}

/**
 * Create Gladia client instance
 */
export function createGladiaClient(): GladiaClient {
  return new GladiaClient();
}
