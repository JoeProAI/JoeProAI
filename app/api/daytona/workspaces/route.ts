import { NextRequest, NextResponse } from 'next/server';
import { createInstantSandbox, SANDBOX_TEMPLATES } from '@/lib/llm/daytona-client';

export async function GET() {
  // Return available templates
  return NextResponse.json({ templates: SANDBOX_TEMPLATES });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template, name, repositoryUrl } = body;

    if (!template) {
      return NextResponse.json({ error: 'Template is required' }, { status: 400 });
    }

    const sandbox = await createInstantSandbox({
      template,
      name,
      repositoryUrl
    });

    return NextResponse.json({ sandbox });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
