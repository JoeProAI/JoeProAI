import OpenAI from 'openai';

// Rate limiting state
const rateLimitState = {
  requests: [] as number[],
  maxRequests: 60,
  windowMs: 60000, // 1 minute
};

export function checkRateLimit(): boolean {
  const now = Date.now();
  // Remove old requests outside the window
  rateLimitState.requests = rateLimitState.requests.filter(
    (timestamp) => now - timestamp < rateLimitState.windowMs
  );
  
  if (rateLimitState.requests.length >= rateLimitState.maxRequests) {
    return false;
  }
  
  rateLimitState.requests.push(now);
  return true;
}

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  
  return new OpenAI({
    apiKey,
  });
}

export async function createOpenAICompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = 'gpt-4-turbo-preview',
  temperature: number = 0.7,
  stream: boolean = false
) {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  const client = getOpenAIClient();
  
  try {
    const response = await client.chat.completions.create({
      model,
      messages: messages as any,
      temperature,
      stream,
    });
    
    return response;
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    if (error.status === 429) {
      throw new Error('OpenAI rate limit exceeded. Please try again later.');
    }
    
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key.');
    }
    
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export async function createOpenAIStreamCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = 'gpt-4-turbo-preview',
  temperature: number = 0.7
) {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  const client = getOpenAIClient();
  
  try {
    const stream = await client.chat.completions.create({
      model,
      messages: messages as any,
      temperature,
      stream: true,
    });
    
    return stream;
  } catch (error: any) {
    console.error('OpenAI Stream Error:', error);
    throw new Error(`OpenAI streaming error: ${error.message}`);
  }
}