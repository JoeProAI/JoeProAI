import { NextRequest, NextResponse } from 'next/server';
import { createXAIStreamCompletion, createXAICompletion } from '@/lib/llm/xai-client';
import type OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider = 'xai', model, messages, temperature = 0.7, stream = false } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    if (stream) {
      const streamResponse = await createXAIStreamCompletion(messages, model || 'grok-2-latest', temperature);

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamResponse) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(encoder.encode('data: ' + JSON.stringify({ content }) + '\n\n'));
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error: any) {
            controller.enqueue(encoder.encode('data: ' + JSON.stringify({ error: error.message }) + '\n\n'));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    } else {
      const response = await createXAICompletion(messages, model || 'grok-2-latest', temperature, false) as OpenAI.ChatCompletion;

      return NextResponse.json({
        content: response.choices?.[0]?.message?.content || '',
        model: response.model || model,
        usage: response.usage || {},
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'LLM API Endpoint - Powered by xAI Grok',
    provider: 'xai',
    methods: ['POST'],
  });
}
