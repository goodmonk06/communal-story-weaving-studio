/**
 * AI Provider Adapter Interface
 * Supports multiple AI providers (OpenAI, Anthropic, local models, etc.)
 */

export interface AIGenerationRequest {
  prompt: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  model?: string
}

export interface AIGenerationResponse {
  text: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  cost?: number
}

export interface IAIProviderAdapter {
  /**
   * Generate text based on a prompt
   */
  generate(request: AIGenerationRequest): Promise<AIGenerationResponse>

  /**
   * Get the name of the provider
   */
  getName(): string

  /**
   * Get available models
   */
  getAvailableModels(): string[]
}

/**
 * OpenAI Provider Adapter
 */
export class OpenAIAdapter implements IAIProviderAdapter {
  private apiKey: string
  private defaultModel: string

  constructor(apiKey?: string, defaultModel = 'gpt-4-turbo-preview') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || ''
    this.defaultModel = defaultModel
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey: this.apiKey })

    const response = await openai.chat.completions.create({
      model: request.model || this.defaultModel,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens,
      messages: [
        ...(request.systemPrompt ? [{ role: 'system' as const, content: request.systemPrompt }] : []),
        { role: 'user' as const, content: request.prompt },
      ],
    })

    const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }

    // Rough cost calculation (GPT-4 pricing as of 2024)
    const inputCost = (usage.prompt_tokens / 1000) * 0.01
    const outputCost = (usage.completion_tokens / 1000) * 0.03
    const totalCost = inputCost + outputCost

    return {
      text: response.choices[0].message.content || '',
      model: response.model,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      },
      cost: totalCost,
    }
  }

  getName(): string {
    return 'openai'
  }

  getAvailableModels(): string[] {
    return ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo']
  }
}

/**
 * Mock AI Provider for testing
 */
export class MockAIAdapter implements IAIProviderAdapter {
  private mockResponse: string

  constructor(mockResponse = 'This is a mock AI response.') {
    this.mockResponse = mockResponse
  }

  async generate(_request: AIGenerationRequest): Promise<AIGenerationResponse> {
    return {
      text: this.mockResponse,
      model: 'mock-model',
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
      cost: 0,
    }
  }

  getName(): string {
    return 'mock'
  }

  getAvailableModels(): string[] {
    return ['mock-model']
  }

  setMockResponse(response: string) {
    this.mockResponse = response
  }
}

// Global adapter registry
let currentProvider: IAIProviderAdapter = new OpenAIAdapter()

export function setAIProvider(provider: IAIProviderAdapter) {
  currentProvider = provider
}

export function getAIProvider(): IAIProviderAdapter {
  return currentProvider
}

// Convenience function
export async function generateAI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  return currentProvider.generate(request)
}
