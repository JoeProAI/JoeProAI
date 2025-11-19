import { NextRequest, NextResponse } from 'next/server';
import { loadAgentConfig } from '@/lib/agents/config';
import { createXAIStreamCompletion } from '@/lib/llm/xai-client';

// Using Node.js runtime because loadAgentConfig uses fs/path modules
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, userMessage } = body;

    if (!agentId || !userMessage) {
      return NextResponse.json({ error: 'Agent ID and message required' }, { status: 400 });
    }

    const config = await loadAgentConfig(agentId);
    if (!config) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const messages = [
      { role: 'system', content: config.systemPrompt },
      { role: 'user', content: userMessage }
    ];

    // Always use xAI/Grok
    const streamResponse = await createXAIStreamCompletion(messages, config.model, config.temperature);

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
