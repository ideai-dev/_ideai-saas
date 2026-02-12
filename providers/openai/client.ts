import OpenAI from 'openai'

// OpenAI Client Configuration
export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
})

// Model configurations
export const OPENAI_MODELS = {
  GPT4O: 'gpt-4o',
  GPT4O_MINI: 'gpt-4o-mini',
  GPT4_TURBO: 'gpt-4-turbo',
  GPT4: 'gpt-4',
  O1: 'o1',
  O1_MINI: 'o1-mini',
} as const

// Embeddings
export const OPENAI_EMBEDDING_MODELS = {
  TEXT_EMBEDDING_3_LARGE: 'text-embedding-3-large',
  TEXT_EMBEDDING_3_SMALL: 'text-embedding-3-small',
  TEXT_EMBEDDING_ADA_002: 'text-embedding-ada-002',
} as const

// Helper functions
export async function generateOpenAICompletion(
  prompt: string,
  model: string = OPENAI_MODELS.GPT4O
) {
  const response = await openaiClient.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
  })
  return response.choices[0]?.message?.content || ''
}

export async function generateOpenAIEmbedding(
  text: string,
  model: string = OPENAI_EMBEDDING_MODELS.TEXT_EMBEDDING_3_SMALL
) {
  const response = await openaiClient.embeddings.create({
    model,
    input: text,
  })
  return response.data[0]?.embedding || []
}

export async function streamOpenAICompletion(
  prompt: string,
  model: string = OPENAI_MODELS.GPT4O
) {
  const stream = await openaiClient.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })
  return stream
}
