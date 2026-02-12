import Anthropic from '@anthropic-ai/sdk'

// Anthropic Client Configuration
export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Model configurations
export const ANTHROPIC_MODELS = {
  CLAUDE_35_SONNET: 'claude-3-5-sonnet-20241022',
  CLAUDE_35_HAIKU: 'claude-3-5-haiku-20241022',
  CLAUDE_3_OPUS: 'claude-3-opus-20240229',
  CLAUDE_3_SONNET: 'claude-3-sonnet-20240229',
  CLAUDE_3_HAIKU: 'claude-3-haiku-20240307',
} as const

// Helper functions
export async function generateAnthropicCompletion(
  prompt: string,
  model: string = ANTHROPIC_MODELS.CLAUDE_35_SONNET,
  maxTokens: number = 4096
) {
  const response = await anthropicClient.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })
  
  const textContent = response.content.find(block => block.type === 'text')
  return textContent && 'text' in textContent ? textContent.text : ''
}

export async function streamAnthropicCompletion(
  prompt: string,
  model: string = ANTHROPIC_MODELS.CLAUDE_35_SONNET,
  maxTokens: number = 4096
) {
  const stream = await anthropicClient.messages.stream({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })
  return stream
}
